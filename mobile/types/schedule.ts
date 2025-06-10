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