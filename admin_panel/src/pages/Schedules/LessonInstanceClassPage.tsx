import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstance.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";

const LessonInstanceClassPage = () => {
   const {user, token} = useAuth();
    const {classId, dateStr} = useParams();
    // const scheduleTemplateLessons = getScheduleForClass(Number(classId));
    // wpisz taki adres aby odpalić tą stronę:
    // http://localhost:5173/schedules/classes/9/dateStr/2025-05-10
    const {data} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "classes",
        token || "",
        Number(classId),
        dateStr
    )
    console.log(data);
    return (
        <div>
            <h1>Schedule for class: {classId} on date: {dateStr}</h1>
            <LessonInstance schedules={[]} />
        </div>
    )
}

export default LessonInstanceClassPage;


