import {ILessonTemplate} from "@/types/schedule.ts";
import LessonTemplateFormModal from "@/components/features/Schedules/modals/LessonTemplateFormModal.tsx";
import {SquarePen, Trash2} from "lucide-react";
import {useState} from "react";
import {DeleteModal} from "@/components/utils/deleteModal.tsx";
import {useDeleteScheduleTemplate} from "@/hooks/scheduleTemplate.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

interface IScheduleTemplateLessonProps {
  lesson: ILessonTemplate | null;
  hourIdx: number;
  idx: number;
}

const ScheduleTempleteLesson = ({
    lesson,
    hourIdx,
    idx
}: IScheduleTemplateLessonProps) => {
    const {classId, roomId, teacherId} = useParams();
    const type = classId ? "classes" : roomId ? "rooms" : teacherId ? "teachers" : "classes";
    const {user, token} = useAuth();
    const [confirmInput, setConfirmInput] = useState("");
    const deleteScheduleTemplateMutation = useDeleteScheduleTemplate(
        `school/${user?.school_id}/lesson_templates`,
        type,
        token || "",
        lesson?.id
    )
    const handleDelete = () => {
        deleteScheduleTemplateMutation.mutate(lesson?.id, {
            onSuccess: () => {
                setConfirmInput("");
                toast.success("Lesson template successfully deleted");
            },
            onError: (error) => {
                toast.error("Failed to delete lesson template");
                console.log(error);
            }
        });
    }

  return (
       <td
           key={`${lesson?.id}-${hourIdx}-${idx}`}
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
               <LessonTemplateFormModal key={`${lesson?.id}-${hourIdx}-${idx}`} lessonTemplateData={lesson}>
                  <SquarePen className="p-1 h-7 w-7 absolute top-0 right-2  cursor-pointer" />
                </LessonTemplateFormModal>
               <DeleteModal
                   className={"absolute bottom-0 right-2 w-6 h-6 rounded-sm"}
                   setConfirmInput={setConfirmInput}
                    confirmInput={confirmInput}
                    valueToConfirm={lesson.subject}
                    handleDelete={handleDelete}
                    item_name={"Lesson template"}
               />
             </div>
           ) : (
             "-"
           )}
         </td>
  )
}
export default ScheduleTempleteLesson;