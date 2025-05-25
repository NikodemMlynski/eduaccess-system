import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstances.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useAuth} from "@/context/AuthProvider.tsx";

const LessonInstanceRoomPage = () => {
    const {user, token} = useAuth();
    const {roomId, dateStr} = useParams();
    // wpisz taki adres aby odpalić tą stronę:
    // http://localhost:5173/schedules/rooms/16/dateStr/2025-05-10

    const {data} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "rooms",
        token || "",
        Number(roomId),
        dateStr
    )
    console.log(data);
    return (
        <div>
            <h1>Schedule for room: {roomId} on date: {dateStr}</h1>
            <LessonInstance schedules={[]} />
        </div>
    )
}

export default LessonInstanceRoomPage;


