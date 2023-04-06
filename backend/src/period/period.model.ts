import mongoose, { Document, Model, Schema } from "mongoose";
import { Status } from "../common/enum";

export interface IPeriod {
  id: string;
  startTime: string;
  endTime: string;
  breakInterval: string;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}

export type PeriodDocument = IPeriod & Document;

const periodSchema: Schema<PeriodDocument> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    breakInterval: {
      type: String,
      default: "0",
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

periodSchema.set("toObject", {
  virtuals: true,
});

export const PeriodModel: Model<PeriodDocument> = mongoose.model(
  "period",
  periodSchema
);
