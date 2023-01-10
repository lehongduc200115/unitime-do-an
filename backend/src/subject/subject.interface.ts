import { ClassType, Status } from "../common/enum";

export interface ISubjectPayload {
  id: string;
  name: string;
  department: string;
  hour: IClassHour;
  classType: ClassType;
  status?: Status;
}

export interface ISubjectRequest extends Request {
  payload: ISubjectPayload[];
}

export interface IClassHour {
  lab: number;
  lec: number;
}
