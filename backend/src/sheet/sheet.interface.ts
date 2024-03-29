import { IClass } from "../class/class.model";
import { ClassType, Status } from "../common/enum";
import { IEnrollment } from "../enrollment/enrollment.model";
import { IInstructor } from "../instructor/instructor.model";
import { ISubject } from "../subject/subject.model";
import { IRoom } from "../room/room.model";
import { IStudent } from "../student/student.model";
import { INewClass } from "../new-class/newClass.model";
import { IPeriod } from "../period/period.model";

interface IRow {
  rows:
    | ISubject
    | IRoom
    | IInstructor
    | IStudent
    | IEnrollment
    | IClass
    | INewClass
    | IPeriod;
  sheetName: string;
}

export type ISheetPayload = IRow;
// export type ISheetPayload = IRow[];

export interface ISheetRequest extends Request {
  payload: {
    data: ISheetPayload[];
  };
}
