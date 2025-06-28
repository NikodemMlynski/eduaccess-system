import {IRoom} from "@/types/rooms.ts";

export interface IRoomAccessCode {
    id: number;
    room: IRoom;
    access_code: string;
}