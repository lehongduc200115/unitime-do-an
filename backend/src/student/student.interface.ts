import { Status } from "../common/enum";

export interface IStudentPayload {
  id: string;
  name: string;
  department: string;
  status?: Status;
}

export interface IStudentRequest extends Request {
  payload: IStudentPayload[];
}
