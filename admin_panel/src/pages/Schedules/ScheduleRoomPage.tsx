import {useParams} from "react-router-dom";
import {getScheduleForRoom} from "@/hooks/scheduleTemplate.ts";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";

const ScheduleRoomPage = () => {
    const {roomId} = useParams();
    const templateScheduleLessons = getScheduleForRoom(Number(roomId));
    return (
        <div>
            <ScheduleTemplate schedules={templateScheduleLessons} />
        </div>
    )
}

export default ScheduleRoomPage;


