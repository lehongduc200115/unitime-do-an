import { ClassType, Status } from "../common/enum";

export interface IEnrollmentPayload {
  id: string;
  name: string;
  department: string;
  status?: Status;
}

export interface IEnrollmentRequest extends Request {
  payload: IEnrollmentPayload[];
}
