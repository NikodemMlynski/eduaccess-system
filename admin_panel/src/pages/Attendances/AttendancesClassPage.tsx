import {useParams} from "react-router-dom";
import {useAttendances} from "@/hooks/attendances.ts";
import {IAttendanceRaw} from "@/types/Attendance.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Loader2} from "lucide-react";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useClass} from "@/hooks/classes.ts";
import AttendancesClassTable from "@/components/features/Attendances/AttendancesClassTable.tsx";
import {useStudentsForClass} from "@/hooks/users.ts";
import LessonInstanceDatePicker from "@/components/features/Schedules/LessonInstanceDatePicker.tsx";

export default function AttendancesClassPage() {
    const {user, token} = useAuth();
    const {classId, dateStr} = useParams();
    const {
        data: attendances,
        isLoading: attendancesLoading,
        isError: attendancesIsError,
        error: attendancesError
    } = useAttendances<IAttendanceRaw>(
        `school/${user?.school_id}/attendances`,
        "classes",
        token || "",
        Number(classId),
        dateStr
    )


    const {
        data: lessonInstances,
        isLoading: lessonInstancesLoading,
        isError: lessonInstancesIsError,
        error: lessonInstancesError
    } = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "classes",
        token || "",
        Number(classId),
        dateStr
    )
    const {
        data: students,
        isLoading: studentsIsLoading,
        isError: studentsIsError,
        error: studentsError
    } = useStudentsForClass(
        `school/${user?.school_id}/students`,
        token || "",
        Number(classId),
    )
    const {
        data: class_,
        isLoading: classIsLoading,
        isError: classIsError,
        error: classError
    } = useClass(
        `school/${user?.school_id}/classes`,
        Number(classId),
        token || ""
    )

    if (attendancesLoading || studentsIsLoading || lessonInstancesLoading || classIsLoading) {
        return <Loader2 className="w-8 h-8 animate-spin" />
    }
    if (attendancesIsError) {
        console.log(attendancesError);
        return <p>{attendancesError?.message}</p>
    }

    if (lessonInstancesIsError) {
        console.log(lessonInstancesError);
        return <p>{lessonInstancesError?.message}</p>
    }
    if (studentsIsError) {
        console.log(studentsError);
        return <p>{studentsError?.message}</p>
    }
    if (classIsError) {
        console.log(classError);
        return <p>{classError?.message}</p>
    }

    console.log(students);
    console.log(lessonInstances)
    return (
        <div className="p-4">
            <h1 className="py-2 text-2xl text-center pb-10">Lekcje dla klasy {class_?.class_name}</h1>
            <LessonInstanceDatePicker link={"attendances"} type={"classes"} dateStr={dateStr} id={Number(classId)} />
            {lessonInstances?.length == 0 ? (
                <h2>Brak wprowadzonych lekcji dla daty: {dateStr}</h2>
            ): (
                 <AttendancesClassTable
                students={students || []}
                lessonInstances={lessonInstances || []}
                attendances={attendances || []}
                />
            ) }

        </div>
    )
}