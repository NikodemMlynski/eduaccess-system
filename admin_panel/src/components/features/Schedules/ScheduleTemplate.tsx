import {ILessonTemplate} from "@/types/schedule";
import {weekdays} from "@/hooks/scheduleTemplate.ts";
import ScheduleTempleteLesson from "@/components/features/Schedules/ScheduleTemplateLesson.tsx";

interface SchedulesProps {
  schedules: ILessonTemplate[];
}

interface IHoursRange {
  start_time: string;
  end_time: string;
}
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export default function ScheduleTemplate({ schedules }: SchedulesProps) {
  console.log(schedules);
  const hoursRange: IHoursRange[] = []
  for (const lesson of schedules) {
    const hourFound = hoursRange.find((hour) => hour.start_time === lesson.start_time || hour.end_time === lesson.end_time)
    if (!hourFound) {
      hoursRange.push({start_time: lesson.start_time, end_time: lesson.end_time})
    }
  }
  const sortedHoursRange = hoursRange.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

  const formattedLessons = sortedHoursRange.map((hour) => {
    const lessonForHours = schedules
        .filter((item) => item.start_time === hour.start_time && item.end_time === hour.end_time)
        .sort((a, b) => a.weekday - b.weekday)
    console.log(lessonForHours);
    let lessonIndex = 0;
    return weekdays.map((_, index) => {
      if (lessonIndex == lessonForHours.length) return null
      console.log(lessonForHours[lessonIndex])
      const lesson = lessonForHours[lessonIndex].weekday === index ? lessonForHours[lessonIndex] : null
      if (lesson) lessonIndex ++;
      console.log(lessonIndex);
      return lesson;
    });
  })
  console.log(formattedLessons)

  return (
         <div className="flex flex-wrap justify-around">
        <table className="w-[70%] border border-gray-200">
          <thead className="bg-gray-100">
            <tr>

              <th className="border border-gray-200 p-2 text-sm font-semibold text-center h-[65px]">
                Hour
              </th>
              {weekdays.map((day) => (
                <th
                  key={day}
                  className="border border-gray-200 p-2 text-sm font-semibold text-center h-[65px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formattedLessons.map((lessons_for_hour, hourIdx) => (
              <tr key={hourIdx}>
                <td className="border border-gray-200 p-1 text-center text-sm text-gray-700 h-[65px]">
                  {sortedHoursRange && sortedHoursRange[hourIdx].start_time} - {sortedHoursRange &&  sortedHoursRange[hourIdx].end_time}
                </td>
                {lessons_for_hour.map((lesson, idx) => {
                  return (
                     <ScheduleTempleteLesson lesson={lesson} hourIdx={hourIdx} idx={idx}/>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}