import { Status } from "../common/enum";

export interface INewClassPayload {
  id: string;
  subjectId: string;
  type?: string;
  entrants: number;
  preferedWeekday?: string;
  preferedPeriod?: string;
  period: number;
  scaleUpClass?: string;
  status?: Status;
}

export interface INewClassRequest extends Request {
  payload: INewClassPayload[];
}
