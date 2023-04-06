import { Status } from "../common/enum";

export interface IPeriodPayload {
  id: string;
  startTime: string;
  endTime: string;
  breakInterval: string;
  status?: Status;
}

export interface IPeriodRequest extends Request {
  payload: IPeriodPayload[];
}
