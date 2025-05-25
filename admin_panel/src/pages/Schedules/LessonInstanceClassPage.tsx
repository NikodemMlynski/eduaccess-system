import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstances.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {Loader2} from "lucide-react";

const LessonInstanceClassPage = () => {
    const {user, token} = useAuth();
    const {classId, dateStr} = useParams();
    const {data, isLoading, isError, error} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "classes",
        token || "",
        Number(classId),
        dateStr
    )
    if (isLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        return <p>{error.message}</p>
    }
    console.log(data);

    return (
        <div>
            <h1 className="text-2xl text-red-500">Popraw to później i wyświetl to w lepszy sposób</h1>
            <h1>Schedule for class: {classId} on date: {dateStr}</h1>
            <LessonInstance lesson_instances={data || []} date={new Date(dateStr || "")} />
        </div>
    )
}

export default LessonInstanceClassPage;


