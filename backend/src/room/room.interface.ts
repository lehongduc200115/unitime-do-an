import { ClassType, Status } from "../common/enum";

export interface IRoomPayload {
  id: string;
  label: string;
  campus: string;
  department?: string;
  status?: Status;
  capacity: number;
  classType: ClassType;
  coordinate: ICoordinate;
}

export interface IRoomRequest extends Request {
  payload: IRoomPayload[];
}
