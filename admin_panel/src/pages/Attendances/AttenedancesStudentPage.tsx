import {useParams} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useAttendances} from "@/hooks/attendances.ts";
import {IAttendance} from "@/types/Attendance.ts";
import StudentAttendances from "@/components/features/Attendances/StudentAttendances.tsx";
import {useUser} from "@/hooks/users.ts";
import {IStudent} from "@/types/Student.ts";
import {Loader2} from "lucide-react";

export default function AttendancesStudentPage() {
    const {studentId, dateStr} = useParams();
    const {user, token} = useAuth();

    const {
        data: attendances,
        isLoading: attendancesIsLoading,
        isError: attendancesIsError,
        error: attendancesError,
    } = useAttendances<IAttendance>(
        `school/${user?.school_id}/attendances`,
        "student",
        token || "",
        Number(studentId),
        dateStr
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

    if (studentIsLoading || attendancesIsLoading) {
        return <Loader2 className="animate-spin h-8 w-8" />
    }

    if (studentIsError) {
        return <p>{studentError.message}</p>
    }
    if (attendancesIsError) {
        return <p>{attendancesError.message}</p>
    }
    console.log(attendances);

    return (
        <div>
            <header className="flex items-center justify-center p-4">
                <h1 className="text-xl">Frekwencja dla {student?.user.first_name} {student?.user.last_name}</h1>
            </header>
            <StudentAttendances attendances={attendances || []} />
        </div>
    )
}