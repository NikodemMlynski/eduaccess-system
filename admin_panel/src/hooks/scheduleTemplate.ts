import { ILessonTemplate } from "@/types/schedule.ts";
import {IClass} from "@/types/Class.ts";
import {IRoom} from "@/types/rooms.ts";
import {ITeacher} from "@/types/Teacher.ts";

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const classes: IClass[] = [
    {
        id: 1,
        class_name: "4D",
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
    },
]
const rooms: IRoom[] = [
    {
        id: 1,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "115A",
        capacity: 32
    },
    {
        id: 2,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "380C",
        capacity: 32
    },
    {
        id: 3,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "315A",
        capacity: 32
    },
    {
        id: 4,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "10A", // wf
        capacity: 32
    },
    {
        id: 5,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "226A",
        capacity: 32
    },
    {
        id: 6,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "155B",
        capacity: 32
    },
    {
        id: 7,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "277C",
        capacity: 32
    },
    {
        id: 8,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "219A",
        capacity: 32
    },
    {
        id: 9,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "18A",
        capacity: 32
    },
    {
        id: 10,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "212A",
        capacity: 32
    },
    {
        id: 11,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "255B",
        capacity: 32
    },
    {
        id: 12,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "3A",
        capacity: 32
    },
    {
        id: 13,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "112A",
        capacity: 32
    },
    {
        id: 14,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "109A",
        capacity: 32
    },
    {
        id: 15,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "250B",
        capacity: 32
    },
    {
        id: 16,
        school_id: 1,
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        updated_at: new Date("2025-05-07T16:04:35.992Z"),
        room_name: "114A",
        capacity: 32
    },
]
const teachers: ITeacher[] = [
    {
        id: 1,
        user: {
            id: 1,
            school_id: 1,
            role: "teacher",
            email: "a@dadasiewicz.pl",
            first_name: "Anna",
            last_name: "Dadasiewicz",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 2,
        user: {
            id: 2,
            school_id: 1,
            role: "teacher",
            email: "w@sieńko.pl",
            first_name: "Wojciech",
            last_name: "Sieńko",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 3,
        user: {
            id: 3,
            school_id: 1,
            role: "teacher",
            email: "a@nowak.pl",
            first_name: "Agata",
            last_name: "Nowak",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 4,
        user: {
            id: 4,
            school_id: 1,
            role: "teacher",
            email: "p@walkowiak.pl",
            first_name: "Piotr",
            last_name: "Walkowiak",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 5,
        user: {
            id: 5,
            school_id: 1,
            role: "teacher",
            email: "a@niewulis.pl",
            first_name: "Anna",
            last_name: "Niewulis",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 6,
        user: {
            id: 6,
            school_id: 1,
            role: "teacher",
            email: "j@geleta.pl",
            first_name: "Jakub",
            last_name: "Geleta",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 7,
        user: {
            id: 7,
            school_id: 1,
            role: "teacher",
            email: "b@żywicka.pl",
            first_name: "Bożena",
            last_name: "Żywicka",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 8,
        user: {
            id: 8,
            school_id: 1,
            role: "teacher",
            email: "m@gostomska.pl",
            first_name: "Marta",
            last_name: "Gostomska",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 9,
        user: {
            id: 9,
            school_id: 1,
            role: "teacher",
            email: "a@michalski.pl",
            first_name: "Andrzej",
            last_name: "Michalski",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 10,
        user: {
            id: 10,
            school_id: 1,
            role: "teacher",
            email: "o@owedyk.pl",
            first_name: "Oksana",
            last_name: "Owedyk",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 11,
        user: {
            id: 11,
            school_id: 1,
            role: "teacher",
            email: "i@łangowska.pl",
            first_name: "Iwona",
            last_name: "Łangowska",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 12,
        user: {
            id: 12,
            school_id: 1,
            role: "teacher",
            email: "j@sikorski.pl",
            first_name: "Jaro",
            last_name: "Sikorski",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
    {
        id: 13,
        user: {
            id: 13,
            school_id: 1,
            role: "teacher",
            email: "p@majchrzak.pl",
            first_name: "Piotr",
            last_name: "Majchrzak",
            created_at: new Date("2025-05-07T16:04:35.992Z"),
            updated_at: new Date("2025-05-07T16:04:35.992Z"),
        }
    },
]
export const templateLesson: ILessonTemplate[] = [
    {
        id: 1,
        class: classes[0],
        room: rooms[0],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "J. Polski",
        teacher: teachers[0],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "08:15",
        end_time: "09:00",
    },
    {
        id: 2,
        class: classes[0],
        room: rooms[0],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "J. Polski",
        teacher: teachers[0],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "09:10",
        end_time: "09:55",
    },
    {
        id: 3,
        class: classes[0],
        room: rooms[1],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "PrPSiO",
        teacher: teachers[1],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "10:05",
        end_time: "10:50",
    },
    {
        id: 4,
        class: classes[0],
        room: rooms[1],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "PrPSiO",
        teacher: teachers[1],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "11:00",
        end_time: "11:45",
    },
    {
        id: 5,
        class: classes[0],
        room: rooms[2],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "J Angielski",
        teacher: teachers[2],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "12:05",
        end_time: "12:50",
    },
    {
        id: 6,
        class: classes[0],
        room: rooms[3],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "WF",
        teacher: teachers[3],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:00",
        end_time: "13:45",
    },
    {
        id: 7,
        class: classes[0],
        room: rooms[1],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "PrPSiO",
        teacher: teachers[1],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:55",
        end_time: "14:40",
    },
    {
        id: 8,
        class: classes[0],
        room: rooms[1],
        weekday: 0, // 0 to poniedziałek 4 - piątek itp.
        subject: "PrPSiO",
        teacher: teachers[1],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "14:50",
        end_time: "15:35",
    },

    // Wtorek
    {
        id: 9,
        class: classes[0],
        room: rooms[3],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "WF",
        teacher: teachers[3],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "08:15",
        end_time: "09:00",
    },
    {
        id: 10,
        class: classes[0],
        room: rooms[4],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "Matematyka",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "09:10",
        end_time: "9:55",
    },
    {
        id: 11,
        class: classes[0],
        room: rooms[4],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "Matematyka",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "10:05",
        end_time: "10:50",
    },
    {
        id: 12,
        class: classes[0],
        room: rooms[5],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "InżPr",
        teacher: teachers[5],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "11:00",
        end_time: "11:45",
    },
    {
        id: 13,
        class: classes[0],
        room: rooms[5],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "InżPr",
        teacher: teachers[5],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "12:05",
        end_time: "12:50",
    },
    {
        id: 14,
        class: classes[0],
        room: rooms[2],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "J Angielski",
        teacher: teachers[2],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:00",
        end_time: "13:45",
    },
    {
        id: 15,
        class: classes[0],
        room: rooms[15],
        weekday: 1, // 0 to poniedziałek 4 - piątek itp.
        subject: "Fizyka",
        teacher: teachers[6],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:55",
        end_time: "14:40",
    },

    // Środa
    {
        id: 16,
        class: classes[0],
        room: rooms[6],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "ADWiM",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "07:20",
        end_time: "08:05",
    },
    {
        id: 17,
        class: classes[0],
        room: rooms[6],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "ADWiM",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "08:15",
        end_time: "09:00",
    },
    {
        id: 18,
        class: classes[0],
        room: rooms[6],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "ADWiM",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "09:10",
        end_time: "09:55",
    },
    {
        id: 19,
        class: classes[0],
        room: rooms[6],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "ADWiM",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "10:05",
        end_time: "10:50",
    },
    {
        id: 20,
        class: classes[0],
        room: rooms[7],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "Geografia",
        teacher: teachers[7],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "11:00",
        end_time: "11:45",
    },
    {
        id: 21,
        class: classes[0],
        room: rooms[8],
        weekday: 2, // 0 to poniedziałek 4 - piątek itp.
        subject: "Historia",
        teacher: teachers[8],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "12:05",
        end_time: "12:50",
    },

    // Czwartek
    {
        id: 22,
        class: classes[0],
        room: rooms[4],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "Matematyka",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "07:20",
        end_time: "08:05",
    },
    {
        id: 23,
        class: classes[0],
        room: rooms[9],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "GW",
        teacher: teachers[7],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "08:15",
        end_time: "09:00",
    },
    {
        id: 24,
        class: classes[0],
        room: rooms[10],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "J Niemiecki",
        teacher: teachers[9],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "09:10",
        end_time: "09:55",
    },
    {
        id: 25,
        class: classes[0],
        room: rooms[11],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "Biologia",
        teacher: teachers[10],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "10:05",
        end_time: "10:50",
    },
    {
        id: 26,
        class: classes[0],
        room: rooms[2],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "J Angielski",
        teacher: teachers[2],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "11:00",
        end_time: "11:45",
    },
    {
        id: 27,
        class: classes[0],
        room: rooms[12],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "Fizyka",
        teacher: teachers[6],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "12:05",
        end_time: "12:50",
    },
    {
        id: 28,
        class: classes[0],
        room: rooms[13],
        weekday: 3, // 0 to poniedziałek 4 - piątek itp.
        subject: "Chemia",
        teacher: teachers[11],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:00",
        end_time: "13:45",
    },

    // Piątek
    {
        id: 29,
        class: classes[0],
        room: rooms[14],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "TiDPrInf ",
        teacher: teachers[12],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "07:20",
        end_time: "08:05",
    },
    {
        id: 30,
        class: classes[0],
        room: rooms[14],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "TiDPrInf ",
        teacher: teachers[12],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "08:15",
        end_time: "09:00",
    },
    {
        id: 31,
        class: classes[0],
        room: rooms[14],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "TiDPrInf ",
        teacher: teachers[12],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "09:10",
        end_time: "09:55",
    },
    {
        id: 32,
        class: classes[0],
        room: rooms[4],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "Matematyka",
        teacher: teachers[4],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "10:05",
        end_time: "10:50",
    },
    {
        id: 33,
        class: classes[0],
        room: rooms[8],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "WOS",
        teacher: teachers[8],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "11:00",
        end_time: "11:45",
    },
    {
        id: 34,
        class: classes[0],
        room: rooms[3],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "WF",
        teacher: teachers[3],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "12:05",
        end_time: "12:50",
    },
    {
        id: 35,
        class: classes[0],
        room: rooms[0],
        weekday: 4, // 0 to poniedziałek 4 - piątek itp.
        subject: "J Polski",
        teacher: teachers[0],
        created_at: new Date("2025-05-07T16:04:35.992Z"),
        start_time: "13:00",
        end_time: "13:45",
    },
]

export const getScheduleForClass = (classId?: number) => {
    return templateLesson.filter((lesson) => lesson.class.id === classId)
}

export const getScheduleForTeacher = (teacherId?: number) => {
    return templateLesson.filter((lesson) => lesson.teacher.id === teacherId)
}

export const getScheduleForRoom = (roomId?: number) => {
    return templateLesson.filter((lesson) => lesson.room.id === roomId)
}
