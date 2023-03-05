import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface ISubject {
  name: string;
  department: string;
  numLabHours: number;
  numLecHours: number;
  preferedWeekDay: string;
  preferedTime: string;
  capacity: number;
  classType: string;
  instructors: string;
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
    numLabHours: {
      type: Number,
    },
    numLecHours: {
      type: Number,
    },
    preferedWeekDay: {
      type: String,
    },
    preferedTime: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    instructors: {
      type: String,
    },
    classType: {
      type: String,
      default: ClassType.LEC,
      index: true,
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
