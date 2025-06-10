import {IAttendance, IAttendanceRaw} from "@/types/Attendance.ts";
import AttendancesClassTable from "@/components/features/Attendances/AttendancesClassTable.tsx";
import {ILessonInstance} from "@/types/schedule.ts";
import {IStudent} from "@/types/Student.ts";

interface AttendancesProps {
    attendances: []
}

const students: IStudent[] = [
    {
            "school_id": 11,
            "id": 7,
            "user": {
                "school_id": 11,
                "id": 23,
                "first_name": "Jakub",
                "last_name": "Schreiber",
                "email": "kubul@sch.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:08:57.974121"),
                "updated_at": new Date("2025-05-07T15:47:58.737555")
            },
            "class_id": 13
        },
        {
            "school_id": 11,
            "id": 9,
            "user": {
                "school_id": 11,
                "id": 25,
                "first_name": "Maks",
                "last_name": "Keina",
                "email": "maksiu@keinicki.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:09:26.555987"),
                "updated_at": new Date("2025-04-17T15:09:26.555987")
            },
            "class_id": 13
        },
        {
            "school_id": 11,
            "id": 10,
            "user": {
                "school_id": 11,
                "id": 26,
                "first_name": "Gabriel",
                "last_name": "Lisiecki",
                "email": "lisicki@gmail.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:13:08.286332"),
                "updated_at": new Date("2025-04-17T15:13:08.286332")
            },
            "class_id": 13
        },
        {
            "school_id": 11,
            "id": 11,
            "user": {
                "school_id": 11,
                "id": 27,
                "first_name": "Jakub",
                "last_name": "Mazurkiewicz",
                "email": "mazur@gmail.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:13:20.142114"),
                "updated_at": new Date("2025-04-17T15:13:20.142114")
            },
            "class_id": 13
        },
        {
            "school_id": 11,
            "id": 12,
            "user": {
                "school_id": 11,
                "id": 28,
                "first_name": "Paweł",
                "last_name": "Laskowski",
                "email": "papcio@gmail.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:14:20.081302"),
                "updated_at": new Date("2025-04-17T15:14:20.081302")
            },
            "class_id": 13
        },
        {
            "school_id": 11,
            "id": 13,
            "user": {
                "school_id": 11,
                "id": 29,
                "first_name": "Piotrek",
                "last_name": "Szwarc",
                "email": "ptiotrulo@gmail.com",
                "role": "student",
                "created_at": new Date("2025-04-17T15:14:32.430664"),
                "updated_at": new Date("2025-04-17T15:14:32.430664")
            },
            "class_id": 13
        },
]

const lessonInstances: ILessonInstance[] = [
    {
        "id": 231,
        "template_id": 20,
        "class_": {
            "id": 13,
            "class_name": "4D",
            "created_at": new Date("2025-04-28T16:07:32.126734"),
            "updated_at": new Date("2025-04-28T16:07:32.126734"),
            "school_id": 11
        },
        "room": {
            "id": 16,
            "room_name": "115A",
            "capacity": 32,
            "created_at": new Date("2025-04-27T21:49:21.735351"),
            "updated_at": new Date("2025-04-27T21:49:21.735351"),
            "school_id": 11
        },
        "teacher": {
            "id": 18,
            "user": {
                "school_id": 11,
                "id": 47,
                "first_name": "Anna",
                "last_name": "Dadasiewicz",
                "email": "anna@dadasiewicz.com",
                "role": "teacher",
                "created_at": new Date("2025-05-19T14:06:19.502758"),
                "updated_at": new Date("2025-05-19T14:06:19.502758")
            }
        },
        "subject": "Polski",
        "start_time": new Date("2025-05-26T08:15:38.433147"),
        "end_time": new Date("2025-05-26T09:00:38.433147"),
        "created_at": new Date("2025-05-23T17:19:39.710728"),
        "updated_at": new Date("2025-05-23T17:19:39.710728")
    },
    {
        "id": 232,
        "template_id": 21,
        "class_": {
            "id": 13,
            "class_name": "4D",
            "created_at": new Date("2025-04-28T16:07:32.126734"),
            "updated_at": new Date("2025-04-28T16:07:32.126734"),
            "school_id": 11
        },
        "room": {
            "id": 16,
            "room_name": "115A",
            "capacity": 32,
            "created_at": new Date("2025-04-27T21:49:21.735351"),
            "updated_at": new Date("2025-04-27T21:49:21.735351"),
            "school_id": 11
        },
        "teacher": {
            "id": 18,
            "user": {
                "school_id": 11,
                "id": 47,
                "first_name": "Anna",
                "last_name": "Dadasiewicz",
                "email": "anna@dadasiewicz.com",
                "role": "teacher",
                "created_at": new Date("2025-05-19T14:06:19.502758"),
                "updated_at": new Date("2025-05-19T14:06:19.502758")
            }
        },
        "subject": "Polski",
        "start_time": new Date("2025-05-26T09:10:38.433147"),
        "end_time": new Date("2025-05-26T09:55:38.433147"),
        "created_at": new Date("2025-05-23T17:19:40.092097"),
        "updated_at": new Date("2025-05-23T17:19:40.092097")
    },
    {
        "id": 233,
        "template_id": 22,
        "class_": {
            "id": 13,
            "class_name": "4D",
            "created_at": new Date("2025-04-28T16:07:32.126734"),
            "updated_at": new Date("2025-04-28T16:07:32.126734"),
            "school_id": 11
        },
        "room": {
            "id": 19,
            "room_name": "380C",
            "capacity": 32,
            "created_at": new Date("2025-04-29T09:12:34.439807"),
            "updated_at": new Date("2025-04-29T09:12:34.439807"),
            "school_id": 11
        },
        "teacher": {
            "id": 20,
            "user": {
                "school_id": 11,
                "id": 49,
                "first_name": "Wojciech",
                "last_name": "Sieńko",
                "email": "w@sienko.com",
                "role": "teacher",
                "created_at": new Date("2025-05-19T14:07:08.734063"),
                "updated_at": new Date("2025-05-19T14:07:08.734063")
            }
        },
        "subject": "PrPSiO",
        "start_time": new Date("2025-05-26T10:05:38.433147"),
        "end_time": new Date("2025-05-26T10:50:38.433147"),
        "created_at": new Date("2025-05-23T17:19:40.280416"),
        "updated_at": new Date("2025-05-23T17:19:40.280416")
    },
    {
        "id": 234,
        "template_id": 23,
        "class_": {
            "id": 13,
            "class_name": "4D",
            "created_at": new Date("2025-04-28T16:07:32.126734"),
            "updated_at": new Date("2025-04-28T16:07:32.126734"),
            "school_id": 11
        },
        "room": {
            "id": 19,
            "room_name": "380C",
            "capacity": 32,
            "created_at": new Date("2025-04-29T09:12:34.439807"),
            "updated_at": new Date("2025-04-29T09:12:34.439807"),
            "school_id": 11
        },
        "teacher": {
            "id": 20,
            "user": {
                "school_id": 11,
                "id": 49,
                "first_name": "Wojciech",
                "last_name": "Sieńko",
                "email": "w@sienko.com",
                "role": "teacher",
                "created_at": new Date("2025-05-19T14:07:08.734063"),
                "updated_at": new Date("2025-05-19T14:07:08.734063")
            }
        },
        "subject": "Prprsio",
        "start_time": new Date("2025-05-26T11:00:38.433147"),
        "end_time": new Date("2025-05-26T11:45:38.433147"),
        "created_at": new Date("2025-05-23T17:19:40.462722"),
        "updated_at": new Date("2025-05-23T17:19:40.462722")
    },
]

const attendances1: IAttendanceRaw[] = [
    {
        "id": 1,
        "student_id": 7,
        "lesson_id": 231,
        "status": "delayed",
        "manual_adjustment": true,
        "created_at": new Date("2025-05-15T14:22:27.637317")
    },
    {
        "id": 2,
        "student_id": 9,
        "lesson_id": 231,
        "status": "present",
        "manual_adjustment": true,
        "created_at": new Date("2025-05-15T14:22:27.637317")
    },
    {
        "id": 3,
        "student_id": 7,
        "lesson_id": 232,
        "status": "present",
        "manual_adjustment": true,
        "created_at": new Date("2025-05-15T14:22:27.637317")
    },
    {
        "id": 4,
        "student_id": 9,
        "lesson_id": 232,
        "status": "present",
        "manual_adjustment": true,
        "created_at": new Date("2025-05-15T14:22:27.637317")
    },
    {
        "id": 1,
        "student_id": 9,
        "lesson_id": 233,
        "status": "absent",
        "manual_adjustment": true,
        "created_at": new Date("2025-05-15T14:22:27.637317")
    },

]

export default function Attendances (
    {attendances}: AttendancesProps)
{
    // console.log(attendances);
    return (
        <AttendancesClassTable students={students} lessonInstances={lessonInstances} attendances={attendances1} />
    )
}