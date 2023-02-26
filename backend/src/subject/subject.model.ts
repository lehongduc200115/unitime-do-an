import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";
import { IClassHour } from "./subject.interface";

export interface ISubject {
  id: string;
  name: string;
  department: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type SubjectDocument = ISubject & Document;

const subjectSchema: Schema<SubjectDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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

subjectSchema.set("toObject", {
  virtuals: true,
});

export const SubjectModel: Model<SubjectDocument> = mongoose.model(
  "subject",
  subjectSchema
);
