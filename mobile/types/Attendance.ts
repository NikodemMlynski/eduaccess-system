import {IStudent} from "@/types/Student";
import {ILessonInstance} from "@/types/schedule";

export type IAttendanceStatus = "present" | "late" | "absent";

export interface IAttendance {
    id: number;
    student: IStudent;
    lesson: ILessonInstance;
    status: IAttendanceStatus;
    manual_adjustment: boolean;
    created_at: Date;
}
export interface IAttendanceRaw {
    id: number;
    student_id: number;
    lesson_id: number;
    status: IAttendanceStatus;
    manual_adjustment: boolean;
    created_at: Date;
}
export interface IAttendanceIn {
    student_id: number;
    lesson_id: number;
    status: IAttendanceStatus;
    manual_adjustment: boolean;
}

export type IAttendanceStats = IAttendanceStatsItem[];

export interface IAttendanceStatsItem {
    subject: string;
    present_percent: number;
    present_count: number;
    total: number;
    absent_count: number;
    late_count: number;
}
