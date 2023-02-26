import { ClassType, Status } from "../common/enum";

export interface IClassPayload {
  id: string;
  name: string;
  department: string;
  status?: Status;
}

export interface IClassRequest extends Request {
  payload: IClassPayload[];
}
