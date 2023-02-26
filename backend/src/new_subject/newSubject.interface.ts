import { ClassType, Status } from "../common/enum";

export interface INewSubjectPayload {
  id: string;
  name: string;
  department: string;
  status?: Status;
}

export interface INewSubjectRequest extends Request {
  payload: INewSubjectPayload[];
}

export interface IClassHour {
  lab: number;
  lec: number;
}
