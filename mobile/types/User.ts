export interface IUserIn {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: "teacher" | "student";
    addition_code: string;
}