import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface INewSubject {
  name: string;
  department: string;
  numLabHours: number;
  numLecHours: number;
  preferedWeekDay: string;
  preferedTime: string;
  capacity: number;
  classType: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type NewSubjectDocument = INewSubject & Document;

const newSubjectSchema: Schema<NewSubjectDocument> = new Schema(
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

newSubjectSchema.set("toObject", {
  virtuals: true,
});

export const NewSubjectModel: Model<NewSubjectDocument> = mongoose.model(
  "newSubject",
  newSubjectSchema
);
