import { ILessonInstance } from "@/types/schedule";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import LessonInstance from "@/components/features/Schedules/LessonInstance.tsx";

interface LessonInstancesProps {
  lesson_instances: ILessonInstance[];
  date: Date;
}

const LessonInstances = ({ lesson_instances, date }: LessonInstancesProps) => {
  const sortedLessons = [...lesson_instances].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const onSubjectClick = () => {
      // tutaj obsłuż logikę wyświetlania modalu
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-xl font-semibold text-white">
        {format(date, "EEEE, dd MMMM", { locale: pl })}
      </div>
        <div className="flex justify-between items-center flex-col w-[300px] gap-2">
        {sortedLessons.map((lesson, idx) => (
            <LessonInstance key={idx} lesson={lesson} />
        ))}
        </div>

    </div>
  );
};
export default LessonInstances;
