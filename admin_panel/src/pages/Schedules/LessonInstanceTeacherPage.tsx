import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstance.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";

const LessonInstanceTeacherPage = () => {
   const {user, token} = useAuth();
    const {teacherId, dateStr} = useParams();
    // wpisz taki adres aby opdpalic strone
    // http://localhost:5173/schedules/teachers/1/dateStr/2025-05-10
    const {data} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "teachers",
        token || "",
        Number(teacherId),
        dateStr
    )
    console.log(data);
    return (
        <div>
            <h1>Schedule for teacher: {teacherId} on date: {dateStr}</h1>
            <LessonInstance schedules={[]} />
        </div>
    )
}

export default LessonInstanceTeacherPage;


