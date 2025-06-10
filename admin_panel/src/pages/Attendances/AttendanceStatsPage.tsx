import {useAttendancesStats} from "@/hooks/attendances.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useParams} from "react-router-dom";
import {Loader2} from "lucide-react";
import AttendanceStatsGrid from "@/components/features/Attendances/AttendancesStats.tsx";
import {useUser} from "@/hooks/users.ts";
import {IStudent} from "@/types/Student.ts";

export default function AttendanceStatsPage() {
    const {user, token} = useAuth();
    const {studentId} = useParams();
    const {
        data: attendanceStats,
        isLoading: attendanceStatsIsLoading,
        isError: attendanceStatsIsError,
        error: attendanceStatsError,
    } = useAttendancesStats(
        `school/${user?.school_id}/attendances`,
        token || "",
        Number(studentId),
    )

    const {
        data: student,
        isLoading: studentIsLoading,
        isError: studentIsError,
        error: studentError,
    } = useUser<IStudent>(
        `school/${user?.school_id}/students/`,
        Number(studentId),
        token || "",
        "student"
    )

    if (attendanceStatsIsLoading || studentIsLoading) {
        return <Loader2 className="animate-spin h-8 w-8"/>
    }
    if (attendanceStatsIsError) {
        return <p>{attendanceStatsError.message}</p>
    }
    if (studentIsError) {
        return <p>{studentError.message}</p>
    }

    return (
        <div className="p-4">
            <header>
                <h1 className="text-2xl text-center pb-8">Statystyki frekwencji dla {student?.user.first_name} {student?.user.last_name}</h1>
            </header>
            <AttendanceStatsGrid data={attendanceStats || []}/>
        </div>
    )
}