import {IClass} from "@/types/Class.ts";
import {IRoom} from "@/types/rooms.ts";
import {ITeacher} from "@/types/Teacher.ts";

export interface ILessonTemplate {
    id: number;
    class_: IClass;
    room: IRoom;
    teacher: ITeacher;
    subject: string;
    weekday: number;
    start_time: string;
    end_time: string;
    created_at: Date;
}

export interface ILessonTemplateIn {
    class_id: number;
    room_id: number;
    teacher_id: number;
    subject: string;
    weekday: number;
    start_time: string;
    end_time: string;
}

export interface ILessonInstance {
    id: number;
    template_id?: number;
    class_: IClass;
    room: IRoom;
    teacher: ITeacher;
    subject: string;
    start_time: Date;
    end_time: Date;
    created_at: Date;
    updated_at: Date;
}

export interface ILessonInstanceIn {
    template_id?: number;
    class_id: number;
    room_id: number;
    teacher_id: number;
    subject: string;
    start_time: string;
    end_time: string;
}