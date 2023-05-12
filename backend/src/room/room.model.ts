import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface IRoom {
  id: string;
  label: string;
  campus: string;
  department: string;
  capacity: number;
  status?: Status;
  classType: string;
  createdBy?: string;
  updatedBy?: string;
}
export type RoomDocument = IRoom & Document;

const roomSchema: Schema<RoomDocument> = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    department: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
    },
    status: {
      type: String,
      default: Status.ACTIVE,
      index: true,
    },
    capacity: {
      type: Number,
      default: -1,
    },
    classType: {
      type: String,
      default: ClassType.LEC,
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

roomSchema.set("toObject", {
  virtuals: true,
});

export const RoomModel: Model<RoomDocument> = mongoose.model(
  "room",
  roomSchema
);
