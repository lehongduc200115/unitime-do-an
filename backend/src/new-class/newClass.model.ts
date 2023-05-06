import mongoose, { Document, Model, Schema } from "mongoose";
import { Status } from "../common/enum";

export interface INewClass {
  id: string;
  type: string;
  subjectId: string;
  preferedWeekDay: string;
  preferedPeriod: string;
  preferedRoom: string;
  preferedCampus: string;
  unrestricted: boolean;
  entrants: number;
  capacity: number;
  period?: number;
  scaleUpClass?: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}
export type NewClassDocument = INewClass & Document;

const newClassSchema: Schema<NewClassDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      default: "LEC",
    },
    subjectId: {
      type: String,
      required: true,
    },
    preferedWeekDay: {
      type: String,
    },
    preferedPeriod: {
      type: String,
    },
    preferedRoom: {
      type: String,
    },
    preferedCampus: {
      type: String,
    },
    unrestricted: {
      type: Boolean,
      default: false,
    },
    capacity: {
      type: Number,
    },
    entrants: {
      type: Number,
      required: false,
    },
    period: {
      type: Number,
      required: false,
    },
    scaleUpClass: {
      type: String,
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

newClassSchema.set("toObject", {
  virtuals: true,
});

export const NewClassModel: Model<NewClassDocument> = mongoose.model(
  "newClass",
  newClassSchema
);
