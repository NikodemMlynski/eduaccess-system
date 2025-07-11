export interface IRoom {
    id: number;
    room_name: string;
    capacity: number;
    created_at: Date;
    updated_at: Date;
    school_id: number;
}
export interface IRoomRaw {
    id: number;
    room_name: string;
}

export interface IRoomAccessCode {
    id: number;
    room: IRoom;
    access_code: string;
}