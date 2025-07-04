import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useClasses} from "@/hooks/classes.ts";
import {useUsers} from "@/hooks/users.ts";
import {IStudent} from "@/types/Student.ts";
import {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import LessonInstanceSelect from "@/components/features/Schedules/selecters/LessonInstanceSelect.tsx";
import {SelectItem} from "@/components/ui/select.tsx";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";

interface IAttendancesSearchValues {
    class_id: number | null;
    student_id: number | null;
    student_date: Date | null;
    class_date: Date | null;
    stats_student_id: number | null;
}

export default function AttendancesPage() {
    const navigate = useNavigate();
    const {user, token} = useAuth();
    const [attendancesSearchValues, setAttendancesSearchValues] = useState<IAttendancesSearchValues>({
        class_id: null,
        student_id: null,
        student_date: null,
        class_date: null,
        stats_student_id: null,
    });
    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError,
        error: classesError,
    } = useClasses(`school/${user?.school_id}/classes`, token || "")

    const {
        data: students,
        isLoading: isStudentLoading,
        isError: isStudentError,
        error: studentsError,
    } = useUsers<IStudent>(
        `school/${user?.school_id}/students`,
        token || "",
        'student',
        {
            paginated: true,
            limit: 100,
        }
    )

    const handleAttendancesSearchValuesChange = (key: keyof IAttendancesSearchValues, value: number | Date)=> {
        setAttendancesSearchValues(prev => ({...prev, [key]: value}))
    }
    const handleAttendancesButtonClick = (type: "classes" | "students", id: number | null, date: Date | null) => {
        console.log(type);
        console.log(id);
        console.log(date);
        if (date) {
            if (id === null) return
            const formated = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`
            navigate(`${type}/${id}/dateStr/${formated}`);
        }
    }

    const handleAttendancesStatsButtonClick = () => {
        if(attendancesSearchValues.stats_student_id) {
            navigate(`stats/${attendancesSearchValues.stats_student_id}`);
        }
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold px-2">Wyszukaj listę obecności </h1>
                </CardHeader>
                <CardContent className="p-4 flex flex-row justify-around">
                    <LessonInstanceSelect
                        isLoading={isClassesLoading}
                        isError={isClassesError}
                        errorMessage={"Failed to load classes"}
                        content={
                        <>
                        {
                            classes && classes.map((class_) => (
                                <SelectItem key={`${class_.id}`} value={`${class_.id}`}>{class_.class_name}</SelectItem>
                            ))
                        }
                        </>
                        }
                        onValueChange={(value) => {
                            handleAttendancesSearchValuesChange("class_id", +value)
                        }}
                        onButtonClick={() => handleAttendancesButtonClick("classes", attendancesSearchValues.class_id, attendancesSearchValues.class_date)}
                        label={"Dla klasy"}
                        date={attendancesSearchValues.class_date}
                        setDate={(date) => handleAttendancesSearchValuesChange("class_date", date)}
                    />
                    <LessonInstanceSelect
                        isLoading={isStudentLoading}
                        isError={isStudentError}
                        errorMessage={"Failed to load students"}
                        content={
                        <>
                        {
                            students && students.users.map((student) => (
                                <SelectItem key={`${student.id}`} value={`${student.id}`}>{student.user.first_name} {student.user.last_name}</SelectItem>
                            ))
                        }
                        </>
                        }
                        onValueChange={(value) => {
                            handleAttendancesSearchValuesChange("student_id", +value)
                        }}
                        onButtonClick={() => handleAttendancesButtonClick("students", attendancesSearchValues.student_id, attendancesSearchValues.student_date)}
                        label={"Dla ucznia"}
                        date={attendancesSearchValues.student_date}
                        setDate={(date) => handleAttendancesSearchValuesChange("student_date", date)}
                    />
                    <LessonTemplateSelect
                        isLoading={isStudentLoading}
                        isError={isStudentError}
                        errorMessage={"Failed to load students"}
                        content={
                        <>
                        {
                            students && students.users.map((student) => (
                                <SelectItem key={`${student.id}`} value={`${student.id}`}>{student.user.first_name} {student.user.last_name}</SelectItem>
                            ))
                        }
                        </>
                        }
                        onValueChange={(value) => {
                            handleAttendancesSearchValuesChange("stats_student_id", +value)
                        }}
                        onButtonClick={handleAttendancesStatsButtonClick}
                        label={"Statystyki ucznia"}
                    />
                </CardContent>
            </Card>
        </div>
    )
}