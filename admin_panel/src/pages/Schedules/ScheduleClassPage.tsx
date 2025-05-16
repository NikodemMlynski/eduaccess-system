import {useParams} from "react-router-dom";
import {useScheduleTemplates} from "@/hooks/scheduleTemplate.ts";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Loader2} from "lucide-react";
import {useClass} from "@/hooks/classes.ts";
import {Button} from "@/components/ui/button.tsx";

const ScheduleClassPage = () => {
    const {user, token} = useAuth();
    const {classId} = useParams();
    const {data, isLoading, isError, error} = useScheduleTemplates(
        `school/${user?.school_id}/lesson_templates`,
        "classes",
        token || "",
        Number(classId)
    )
    const {data: class_data, isLoading: classesIsLoading, isError: classesIsError, error: classError} = useClass(`school/${user?.school_id}/classes`, Number(classId), token || "");

    if (isLoading || classesIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        console.log(error);
        return <p>{error.message}</p>
    }
    if (classesIsError) {
        console.log();
        return <p>{classError.message}</p>
    }
    console.log(class_data);
    return (
        <div className="overflow-auto px-4 py-2">
            <div>
                <Button>Add new lesson</Button>
             <h1 className="text-4xl font-semibold text-center mb-10">{class_data?.class_name}</h1>
            </div>
             <ScheduleTemplate schedules={data || []} />
        </div>
    )
}

export default ScheduleClassPage;


