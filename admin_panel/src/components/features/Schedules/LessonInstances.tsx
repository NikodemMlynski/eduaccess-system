import { ILessonInstance } from "@/types/schedule";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import LessonInstance from "@/components/features/Schedules/LessonInstance.tsx";

interface LessonInstancesProps {
  lesson_instances: ILessonInstance[];
}

const LessonInstances = ({ lesson_instances }: LessonInstancesProps) => {
  const sortedLessons = [...lesson_instances].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <div className="p-4 space-y-4">
        <div className="flex justify-between items-center flex-col w-full gap-2">
        {sortedLessons.map((lesson, idx) => (
            <LessonInstance key={idx} lesson={lesson} />
        ))}
        </div>

    </div>
  );
};
export default LessonInstances;
