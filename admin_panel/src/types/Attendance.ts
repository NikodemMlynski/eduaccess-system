import {IStudent} from "@/types/Student.ts";
import {ILessonInstance} from "@/types/schedule.ts";

type attendanceStatus = "present" | "absent" | "delayed"

export interface IAttendance {
    id: number;
    student: IStudent;
    lesson: ILessonInstance;
    status: attendanceStatus;
    manual_adjustment: boolean;
    created_at: Date;
}
export interface IAttendanceRaw {
    id: number;
    student_id: number;
    lesson_id: number;
    status: attendanceStatus;
    manual_adjustment: boolean;
    created_at: Date;
}