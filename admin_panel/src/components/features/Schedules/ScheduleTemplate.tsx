import {ILessonTemplate} from "@/types/schedule";
import {weekdays} from "@/hooks/scheduleTemplate.ts";
import {Button} from "@/components/ui/button.tsx";
import {SquarePen} from "lucide-react";

interface SchedulesProps {
  schedules: ILessonTemplate[];
}

// const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
// const lessonHours = [
//   "7:20 - 8:05",
//   "8:15 - 9:00",
//   "9:10 - 9:55",
//   "10:05 - 10:50",
//   "11:00 - 11:45",
//   "11:55 - 12:40",
//   "12:50 - 13:35",
//   "13:55 - 14:40",
//   "14:50 - 15:35",
// ];
interface IHoursRange {
  start_time: string;
  end_time: string;
}
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export default function ScheduleTemplate({ schedules }: SchedulesProps) {
  const hoursRange: IHoursRange[] = []
  for (const lesson of schedules) {
    const hourFound = hoursRange.find((hour) => hour.start_time === lesson.start_time || hour.end_time === lesson.end_time)
    if (!hourFound) {
      hoursRange.push({start_time: lesson.start_time, end_time: lesson.end_time})
    }
  }
  const sortedHoursRange = hoursRange.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

  const formattedLessons = sortedHoursRange.map((hour, index) => {
    const lessonForHours = schedules.filter((item) => item.start_time === hour.start_time && item.end_time === hour.end_time)
    let lessonIndex = 0;
    const lessons = weekdays.map((_, index) => {
      if (lessonIndex == lessonForHours.length) return null
      const lesson = lessonForHours[lessonIndex].weekday === index ? lessonForHours[lessonIndex] : null
      if (lesson) lessonIndex ++;
      return lesson;
    });
    return lessons
  })

  const handleEditButtonClick = () => {
    alert("Tutaj powinien się wyświetlić modal z możliwością edycji tej lekcji, bądź jej usunięcia, trzeba zrobić to w taki sposób aby jedną funkcją updateować plan dla klas, nauczycieli oraz sal. Żeby domyślnie zapisywało dane klasy którą wybrałeś i nie pokazywało jej już w formularzu tak samo z nauczycielami i salami")
  }

  return (
    <div className="overflow-auto px-4 py-2">
      <h1 className="text-4xl font-semibold text-center mb-10">4D</h1> {/* tu trzeba podać dane realnej klasy*/}
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
                {lessons_for_hour.map((lesson) => {
                  return (
                     <td
                       key={`${lesson?.id}-${hourIdx}`}
                       className="border border-gray-200 p-1 text-center text-sm text-gray-800 h-[65px]"
                     >
                       {lesson ? (
                         <div className="relative pr-2">
                           <div className="font-semibold">{lesson.subject}</div>
                           <div className="text-xs text-gray-500">
                             {lesson.teacher.user.first_name} {lesson.teacher.user.last_name}
                           </div>
                           <div className="text-xs text-gray-500">
                             {lesson.room.room_name}
                           </div>
                              <SquarePen onClick={handleEditButtonClick} className="p-1 h-6 w-6 absolute top-2 right-2 cursor-pointer" />
                         </div>
                       ) : (
                         "-"
                       )}
                     </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}