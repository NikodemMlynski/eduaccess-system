export interface IUser {
    school_id: number;
    id: number; 
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    created_at: Date;
    updated_at: Date;
}