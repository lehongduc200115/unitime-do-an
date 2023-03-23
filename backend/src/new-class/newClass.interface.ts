import { Status } from "../common/enum";

export interface INewClassPayload {
  id: string;
  subjectId: string;
  type?: string;
  name: string;
  department: string;
  status?: Status;
}

export interface INewClassRequest extends Request {
  payload: INewClassPayload[];
}
