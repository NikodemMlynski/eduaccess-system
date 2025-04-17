import { IUser } from "./User";

export interface IStudent {
  id: number;
  school_id: number;
  user: IUser;
  class_id?: number;
}
