import { ClassType, Status } from "../common/enum";

export interface IInstructorPayload {
  id: string;
  name: string;
  department: string;
  status?: Status;
}

export interface IInstructorRequest extends Request {
  payload: IInstructorPayload[];
}
