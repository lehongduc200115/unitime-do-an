import mongoose, { Document, Model, Schema } from "mongoose";
import { Status } from "../common/enum";

export interface IClass {
  id: string;
  name: string;
  classId: string;
  studentId: string;
  instructorId: string;
  roomId: string;
  weekDay: number;
  startTime: number;
  endTime: number;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type ClassDocument = IClass & Document;

const classSchema: Schema<ClassDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    classId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    weekDay: {
      type: Number,
    },
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
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

classSchema.set("toObject", {
  virtuals: true,
});

export const ClassModel: Model<ClassDocument> = mongoose.model(
  "class",
  classSchema
);
