import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface ILecturer {
  name: string;
  department: string;
  weeklyTimetable: [IDailyTimetable];
  status?: Status;
  classType: ClassType;
  createdBy?: string;
  updatedBy?: string;
}
export type LecturerDocument = ILecturer & Document;

const lecturerSchema: Schema<LecturerDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    weeklyTimetable: {
      type: [Array],
      required: true,
    },
    status: {
      type: String,
      default: Status.ACTIVE,
      index: true,
    },
    classType: {
      type: String,
      default: ClassType.ALL,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

lecturerSchema.set("toObject", {
  virtuals: true,
});

export const LecturerModel: Model<LecturerDocument> = mongoose.model(
  "lecturer",
  lecturerSchema
);
