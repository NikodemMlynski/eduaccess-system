import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstances.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useUser} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import LessonInstanceFormModal from "@/components/features/Schedules/modals/LessonInstanceFormModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import LessonInstanceDatePicker from "@/components/features/Schedules/LessonInstanceDatePicker.tsx";
import {Loader2} from "lucide-react";

const LessonInstanceTeacherPage = () => {
   const {user, token} = useAuth();
    const {teacherId, dateStr} = useParams();
    const {data: teacherData, isLoading: teacherIsLoading, isError: teacherIsError, error: teacherError} = useUser<ITeacher>(
`school/${user?.school_id}/teachers/`,
         Number(teacherId),
         token || "",
    "teacher"
    )
    const {data, isLoading, isError, error} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "teachers",
        token || "",
        Number(teacherId),
        dateStr
    )
    if (isLoading || teacherIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        return <p>{error.message}</p>
    }
    if (teacherIsError) {
        return <p>{teacherError.message}</p>
    }

    return (
        <div className="flex justify-around">
            <LessonInstanceFormModal
                defaultDate={new Date(dateStr || "")}
                teacher={{
                    teacherId: Number(teacherId),
                    fullName: `${teacherData?.user.first_name} ${teacherData?.user.last_name}`
                }}
            >
                <Button variant="default">Add new lesson</Button>
            </LessonInstanceFormModal>
            <div className="flex flex-col w-[400px]">
                <LessonInstanceDatePicker
                    dateStr={dateStr}
                    type={"teachers"}
                    id={Number(teacherId)} />
                <LessonInstance lesson_instances={data || []} />
            </div>
        </div>
    )
}

export default LessonInstanceTeacherPage;


