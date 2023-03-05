import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface IEnrollment {
  id: string;
  classId: string;
  subjectId: string;
  studentId: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type EnrollmentDocument = IEnrollment & Document;

const enrollmentSchema: Schema<EnrollmentDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    studentId: {
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

enrollmentSchema.set("toObject", {
  virtuals: true,
});

export const EnrollmentModel: Model<EnrollmentDocument> = mongoose.model(
  "enrollment",
  enrollmentSchema
);
