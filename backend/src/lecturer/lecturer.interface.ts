import { ClassType, Status } from "../common/enum";

export interface ILecturerPayload {
  id: string;
  department: string;
  weeklyTimetable: [IDailyTimetable];
  status?: Status;
  classType: ClassType;
  coordinate: ICoordinate;
}

export interface ILecturerRequest extends Request {
  payload: ILecturerPayload[];
}
