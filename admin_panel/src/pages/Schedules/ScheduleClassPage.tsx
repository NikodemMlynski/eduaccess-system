import {useParams} from "react-router-dom";
import {getScheduleForClass} from "@/hooks/scheduleTemplate.ts";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";

const ScheduleClassPage = () => {
    const {classId} = useParams();
    const scheduleTemplateLessons = getScheduleForClass(Number(classId));
    return (
        <div>
            <h1>Schedule for teacher: {classId}</h1>
            <ScheduleTemplate schedules={scheduleTemplateLessons} />
        </div>
    )
}

export default ScheduleClassPage;


