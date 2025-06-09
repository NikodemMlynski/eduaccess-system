import {useParams} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useAttendances} from "@/hooks/attendances.ts";
import {IAttendance} from "@/types/Attendance.ts";

export default function AttendancesStudentPage() {
    const {studentId, dateStr} = useParams();
    const {user, token} = useAuth();

    const {
        data,
    } = useAttendances<IAttendance>(
        `school/${user?.school_id}/attendances`,
        "student",
        token || "",
        Number(studentId),
        dateStr
    )
    console.log(data);
    return (
        <h1>Dla studenta: {studentId}, data: {dateStr}</h1>// w przyszłości tu się wprowadzi realne dane
    )
}