import { IClass } from "../class/class.model";
import { ClassType, Status } from "../common/enum";
import { IEnrollment } from "../enrollment/enrollment.model";
import { IInstructor } from "../instructor/instructor.model";
import { INewSubject } from "../new_subject/newSubject.model";
import { IRoom } from "../room/room.model";
import { IStudent } from "../student/student.model";
import { ISubject } from "../subject/subject.model";

interface IRow {
  rows:
    | ISubject
    | IRoom
    | IInstructor
    | IStudent
    | IEnrollment
    | IClass
    | INewSubject;
  sheetName: string;
}

export type ISheetPayload = IRow;
// export type ISheetPayload = IRow[];

export interface ISheetRequest extends Request {
  payload: {
    data: ISheetPayload[];
  };
}
