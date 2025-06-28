import {IUser} from "@/types/User.ts";
import {IRoom} from "@/types/rooms.ts";

export type accessStatus = "denied" | "granted";

export interface IAccessLogRaw {
    id: number;
    user_id: number;
    room_id: number;
    access_start_time: Date;
    access_end_time: Date;
    reason: string;
    access_status: accessStatus;
    created_at: Date;
}

export interface IAccessLog {
    id: number;
    user: IUser
    room: IRoom;
    access_start_time: Date;
    access_end_time: Date;
    reason: string;
    access_status: accessStatus;
    created_at: Date;
}

export interface IAccessLogIn {
    user_id: number;
    room_id: number;
    access_time: Date;
}
export interface IAccessLogRequestIn {
    user_id: number;
    room_id: number;
    access_time: Date;
    access_code: string;
}

export interface IAccessLogApproval {
    status: accessStatus;
    user_id: number | null;
    current_time: string;
}
