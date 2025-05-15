import { ILessonTemplateDay } from "@/types/schedule";

interface SchedulesProps {
  schedules: ILessonTemplateDay[];
}

const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
const lessonHours = [
  "7:20 - 8:05",
  "8:15 - 9:00",
  "9:10 - 9:55",
  "10:05 - 10:50",
  "11:00 - 11:45",
  "11:55 - 12:40",
  "12:50 - 13:35",
  "13:55 - 14:40",
  "14:50 - 15:35",
];

export default function ScheduleTemplate({ schedules }: SchedulesProps) {
  const getLesson = (day: string, hourIndex: number) => {
    return schedules.find(
      (lesson) => lesson.day === day && lesson.lessonNumber === hourIndex + 1
    );
  };

  return (
    <div className="overflow-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Plan lekcji</h1>
      <div className="rounded-2xl shadow bg-white overflow-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-sm font-semibold text-center h-[85px] w-[100px]">
                Nr
              </th>
              <th className="border border-gray-200 p-2 text-sm font-semibold text-center h-[85px] w-[100px]">
                Godz
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-200 p-2 text-sm font-semibold text-center h-[85px] w-[100px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lessonHours.map((hour, hourIdx) => (
              <tr key={hourIdx}>
                <td className="border border-gray-200 p-2 text-center text-sm text-gray-700 h-[85px] w-[100px]">
                  {hourIdx + 1}
                </td>
                <td className="border border-gray-200 p-2 text-center text-sm text-gray-700 h-[85px] w-[100px]">
                  {hour}
                </td>
                {days.map((day) => {
                  const lesson = getLesson(day, hourIdx);
                  return (
                    <td
                      key={`${day}-${hourIdx}`}
                      className="border border-gray-200 p-2 text-center text-sm text-gray-800 h-[85px] w-[100px]"
                    >
                      {lesson ? (
                        <div className="space-y-1">
                          <div className="font-semibold">{lesson.subject}</div>
                          <div className="text-xs text-gray-500">
                            {typeof lesson.teacher === "string"
                              ? lesson.teacher
                              : String(lesson.teacher)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.classroom}
                          </div>
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