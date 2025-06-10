import { IUser } from "@/types/User";
import {IClass} from "@/types/Class";

export interface IStudent {
    id: number;
    school_id: number;
    class_: IClass
    user: IUser;
}