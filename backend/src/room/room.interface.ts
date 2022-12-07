import { ClassType, Status } from "../common/enum";

export interface IRoomPayload {
  id: string;
  department: string;
  weeklyTimetable: [IDailyTimetable];
  status?: Status;
  capacity: number;
  classType: ClassType;
  coordinate: ICoordinate;
}

export interface IRoomRequest extends Request {
  payload: IRoomPayload;
}
