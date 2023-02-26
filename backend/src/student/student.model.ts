import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface IStudent {
  id: string;
  name: string;
  department: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type StudentDocument = IStudent & Document;

const studentSchema: Schema<StudentDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: Status.ACTIVE,
      index: true,
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

studentSchema.set("toObject", {
  virtuals: true,
});

export const StudentModel: Model<StudentDocument> = mongoose.model(
  "student",
  studentSchema
);
