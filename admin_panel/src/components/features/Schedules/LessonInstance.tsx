import {ILessonInstance} from "@/types/schedule.ts";
import {Card} from "@/components/ui/card.tsx";
import {format} from "date-fns";
import {SquarePen} from "lucide-react";
import {useState} from "react";
import {DeleteModal} from "@/components/utils/deleteModal.tsx";
import {useDeleteLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {toast} from "react-toastify";
import LessonInstanceFormModal from "@/components/features/Schedules/modals/LessonInstanceFormModal.tsx";

interface ILessonInstanceProps {
    lesson: ILessonInstance;
}

const LessonInstance = ({
    lesson
}: ILessonInstanceProps) => {
    const {user, token} = useAuth();
    const [confirmInput, setConfirmInput] = useState("");
    const deleteLessonMutation= useDeleteLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        token || "",
    )
    const handleDelete = () => {
        deleteLessonMutation.mutate(lesson.id, {
            onSuccess: () => {
                toast.success("Lesson successfully deleted");
                setConfirmInput("");
            },
            onError: (error) => {
                console.log(error);
                toast.error(error.message || "Failed to delete lesson");
            }
        })
    }
    return (
        <Card
          key={lesson.id}
          className="w-full flex justify-between flex-col gap-1 px-6 pr-8 py-1 relative"
        >
            <h3 className="text-lg font-semibold indent-4 cursor-pointer"

            >{lesson.subject}</h3>
            <div className="text-muted-foreground text-sm">
                <span className="tracking-wide">{format(lesson.start_time, "HH:mm")}
                    <span>-</span>
                    {format(lesson.end_time, "HH:mm")}
                </span>, {" "}
                <span>classroom {lesson.room.room_name}</span>
            </div>
            <span className="text-muted-foreground text-sm pb-1">{lesson.teacher.user.first_name} {lesson.teacher.user.last_name}</span>
            <LessonInstanceFormModal
                lessonInstanceData={lesson}
            >
                  <SquarePen className="p-1 h-7 w-7 absolute top-0 right-2  cursor-pointer" />
            </LessonInstanceFormModal>
            <DeleteModal
                className={"absolute bottom-2 right-2 cursor-pointer w-7 h-7"}
                setConfirmInput={setConfirmInput}
                confirmInput={confirmInput}
                valueToConfirm={lesson.subject}
                handleDelete={handleDelete}
                item_name={"Lesson"}
            />
        </Card>
    )
}
export default LessonInstance;