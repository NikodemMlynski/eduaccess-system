import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import {useRooms} from "@/hooks/rooms.ts";
import {IRoom} from "@/types/rooms.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useClasses} from "@/hooks/classes.ts";
import {useUsers} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";
import LessonInstanceSelect from "@/components/features/Schedules/selecters/LessonInstanceSelect.tsx";

interface ILessonTemplateSearchValues {
    class_id: number | null;
    room_id: number | null;
    teacher_id: number | null;
}

interface ILessonInstanceSearchValues {
    class_id: null,
    teacher_id: null,
    room_id: null,
    class_date: null,
    teacher_date: null,
    room_date: null,
}

export function SchedulesPage() {
    const navigate = useNavigate();
    const {user, token} = useAuth();
    const {data: rooms, isLoading: isRoomsLoading, isError: isRoomsError} = useRooms<IRoom>(
        `school/${user?.school_id}/rooms`,
        token || "",
        {
            paginated: true,
            limit: 100,
        }
    )
    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError
    } = useClasses(`school/${user?.school_id}/classes`, token || "")
    const {data: teachers, isLoading: isTeachersLoading, isError: isTeachersError} = useUsers<ITeacher>(
        `school/${user?.school_id}/teachers`,
        token || "",
        "teacher",
        {
            paginated: true,
            limit: 100,
        }
    )

    const [lessonTemplateSearchValues, setLessonTemplateSearchValues] = useState<ILessonTemplateSearchValues>({
        class_id: null,
        teacher_id: null,
        room_id: null,
    });

    const [lessonInstancesSearchValues, setLessonInstanceSearchValues] = useState<ILessonInstanceSearchValues>({
        class_id: null,
        teacher_id: null,
        room_id: null,
        class_date: null,
        teacher_date: null,
        room_date: null,
    })
    const handleLessonInstanceSearchValuesChange = (key: keyof ILessonInstanceSearchValues, value: number | Date) => {
        setLessonInstanceSearchValues(prev => ({...prev, [key]: value}))
    }

    const handleLessonTemplateSearchValuesChange = (key: keyof ILessonTemplateSearchValues, value: number) => {
        setLessonTemplateSearchValues((prev) => ({...prev, [key]: value}))
    }

    const handleTemplateButtonClick = (type: "classes" | "rooms" | "teachers", id: number | null) => {
        if (id) navigate(`${type}/${id}`)
    }

    const handleLessonButtonClick = (type: "classes" | "rooms" | "teachers", id: number | null, date: Date | null) => {
        if (date) {
            const formated = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate() + 1}`.padStart(2, "0")}`
            navigate(`${type}/${id}/dateStr/${formated}`);
        }
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold px-2">Wyszukaj szablon planu lekcji</h1>
                </CardHeader>
                <CardContent className="p-4 flex flex-row justify-around">
                    <LessonTemplateSelect
                        isLoading={isClassesLoading}
                        isError={isClassesError}
                        errorMessage={"Błąd pobierania klas"}
                        content={
                            <>
                                {classes && classes.map((class_) => (
                                        <SelectItem key={`${class_.id}`}
                                                    value={`${class_.id}`}>{class_.class_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            handleLessonTemplateSearchValuesChange("class_id", +value)
                        }}
                        onButtonClick={() => handleTemplateButtonClick("classes", lessonTemplateSearchValues.class_id)}
                        label={"Dla klasy"}

                    />
                    <LessonTemplateSelect
                        isLoading={isTeachersLoading}
                        isError={isTeachersError}
                        errorMessage={"Błąd pobierania nauczycieli"}
                        content={
                            <>
                                {teachers && teachers.users.map((teacher) => (
                                        <SelectItem key={`${teacher.id}`}
                                                    value={`${teacher.id}`}>{teacher.user.first_name} {teacher.user.last_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            console.log(value);
                            handleLessonTemplateSearchValuesChange("teacher_id", +value)
                        }}
                        onButtonClick={() => handleTemplateButtonClick("teachers", lessonTemplateSearchValues.teacher_id)}
                        label={"Dla nauczyciela"}

                    />
                    <LessonTemplateSelect
                        isLoading={isRoomsLoading}
                        isError={isRoomsError}
                        errorMessage={"Błąd pobierania sal lekcyjnych"}
                        content={
                            <>
                                {rooms && rooms.rooms.map((room) => (
                                        <SelectItem key={`${room.id}`} value={`${room.id}`}>{room.room_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            console.log(value);
                            handleLessonTemplateSearchValuesChange("room_id", +value)
                        }}
                        onButtonClick={() => handleTemplateButtonClick("rooms", lessonTemplateSearchValues.room_id)}
                        label={"Dla sali lekcyjnej"}

                    />

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold px-2">Wyszukaj szablon planu lekcji</h1>
                </CardHeader>
                <CardContent className="p-4 flex flex-row justify-around">
                    <LessonInstanceSelect
                        isLoading={isClassesLoading}
                        isError={isClassesError}
                        errorMessage={"Błąd pobierania klas"}
                        content={
                            <>
                                {classes && classes.map((class_) => (
                                        <SelectItem key={`${class_.id}`} value={`${class_.id}`}>{class_.class_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            console.log(value);
                            handleLessonInstanceSearchValuesChange("class_id", +value)
                        }}
                        onButtonClick={() => handleLessonButtonClick("classes", lessonInstancesSearchValues.class_id, lessonInstancesSearchValues.class_date)}
                        label={"Dla klasy"}
                        date={lessonInstancesSearchValues.class_date}
                        setDate={(date) => handleLessonInstanceSearchValuesChange("class_date", date)}
                    />
                    <LessonInstanceSelect
                        isLoading={isClassesLoading}
                        isError={isClassesError}
                        errorMessage={"Błąd pobierania nauczycieli"}
                        content={
                            <>
                                {teachers && teachers.users.map((teacher) => (
                                        <SelectItem key={`${teacher.id}`} value={`${teacher.id}`}>{teacher.user.first_name} {teacher.user.last_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            console.log(value);
                            handleLessonInstanceSearchValuesChange("teacher_id", +value)
                        }}
                        onButtonClick={() => handleLessonButtonClick("teachers", lessonInstancesSearchValues.teacher_id, lessonInstancesSearchValues.teacher_date)}
                        label={"Dla nauczyciela"}
                        date={lessonInstancesSearchValues.teacher_date}
                        setDate={(date) => handleLessonInstanceSearchValuesChange("teacher_date", date)}
                    />
                    <LessonInstanceSelect
                        isLoading={isClassesLoading}
                        isError={isClassesError}
                        errorMessage={"Błąd pobierania sali"}
                        content={
                            <>
                                {rooms && rooms.rooms.map((room) => (
                                        <SelectItem key={`${room.id}`} value={`${room.id}`}>{room.room_name}</SelectItem>
                                    )
                                )}
                            </>
                        }
                        onValueChange={(value) => {
                            console.log(value);
                            handleLessonInstanceSearchValuesChange("room_id", +value)
                        }}
                        onButtonClick={() => handleLessonButtonClick("rooms", lessonInstancesSearchValues.room_id, lessonInstancesSearchValues.room_date)}
                        label={"Dla sali lekcyjnej"}
                        date={lessonInstancesSearchValues.room_date}
                        setDate={(date) => handleLessonInstanceSearchValuesChange("room_date", date)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
