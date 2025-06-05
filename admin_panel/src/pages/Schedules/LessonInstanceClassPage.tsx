import { useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstances.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import LessonInstanceFormModal from "@/components/features/Schedules/modals/LessonInstanceFormModal.tsx";
import {useClass} from "@/hooks/classes.ts";
import LessonInstanceDatePicker from "@/components/features/Schedules/LessonInstanceDatePicker.tsx";

const LessonInstanceClassPage = () => {
    const {user, token} = useAuth();
    const {classId, dateStr} = useParams();
    const {data: classData, isLoading: classIsLoading, isError: classIsError, error: classError} = useClass(
        `school/${user?.school_id}/classes`, Number(classId), token || ""
    )
    const {data, isLoading, isError, error} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "classes",
        token || "",
        Number(classId),
        dateStr
    )
    if (isLoading || classIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        return <p>{error.message}</p>
    }
    if (classIsError) {
        return <p>{classError.message}</p>
    }

    return (
        <div className="flex justify-around">
            <LessonInstanceFormModal
                defaultDate={new Date(dateStr || "")}
                class_={{
                    classId: Number(classId),
                    className: classData?.class_name
                }}
            >
                <Button variant="default">Add new lesson</Button>
            </LessonInstanceFormModal>
            <div className="flex flex-col w-[400px]">
                <LessonInstanceDatePicker
                    link={"schedules"}
                    dateStr={dateStr}
                    type={"classes"}
                    id={Number(classId)} />
                <LessonInstance lesson_instances={data || []} />
            </div>
        </div>
    )
}

export default LessonInstanceClassPage;
