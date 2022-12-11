import { ClassType, Status } from "../common/enum";

export interface ILecturerPayload {
  name: string;
  department: string;
  weeklyTimetable: [IDailyTimetable];
  classType: ClassType;
  status?: Status;
}

export interface ILecturerRequest extends Request {
  payload: ILecturerPayload[];
}
