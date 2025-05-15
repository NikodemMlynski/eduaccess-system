import {useParams} from "react-router-dom";
import {getScheduleForTeacher} from "@/hooks/scheduleTemplate.ts";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";

const ScheduleTeacherPage = () => {
    const {teacherId} = useParams();
    const scheduleTemplateLessons = getScheduleForTeacher(Number(teacherId));
    return (
        <div>
            <ScheduleTemplate schedules={scheduleTemplateLessons} />
        </div>
    )
}

export default ScheduleTeacherPage;


