import {useParams} from "react-router-dom";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useScheduleTemplates} from "@/hooks/scheduleTemplate.ts";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useUser} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import LessonTemplateFormModal from "@/components/features/Schedules/modals/LessonTemplateFormModal.tsx";

const ScheduleTeacherPage = () => {
    const {user, token} = useAuth();
    const {teacherId} = useParams();
    const {data, isLoading, isError, error} = useScheduleTemplates(
        `school/${user?.school_id}/lesson_templates`,
        "teachers",
        token || "",
        Number(teacherId)
    )
    const {data: teacherData, isLoading: teachersIsLoading, isError: teachersIsError, error: teacherError} = useUser<ITeacher>(
        `school/${user?.school_id}/teachers/`, Number(teacherId), token || "", "teacher");

    if (isLoading || teachersIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        console.log(error);
        return <p>{error.message}</p>
    }
    if (teachersIsError) {
        console.log();
        return <p>{teacherError.message}</p>
    }
    return (
        <div className="overflow-auto px-4 py-2">
            <div>
                <LessonTemplateFormModal teacher={{
                    teacherId: teacherData?.id,
                    fullName: `${teacherData?.user.first_name} ${teacherData?.user.last_name}`
                }}>
                    <Button variant="default">Add new lesson</Button>
                </LessonTemplateFormModal>
             <h1 className="text-4xl font-semibold text-center mb-10">{teacherData?.user.first_name} {teacherData?.user.last_name}</h1>
            </div>
             <ScheduleTemplate schedules={data || []} />
        </div>
    )
}

export default ScheduleTeacherPage;


