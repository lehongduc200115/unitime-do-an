import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface IInstructor {
  id: string;
  name: string;
  department: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type InstructorDocument = IInstructor & Document;

const instructorSchema: Schema<InstructorDocument> = new Schema(
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

instructorSchema.set("toObject", {
  virtuals: true,
});

export const InstructorModel: Model<InstructorDocument> = mongoose.model(
  "instructor",
  instructorSchema
);
