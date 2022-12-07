import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Status } from "../common/enum";

export interface IRoom {
  id: string;
  department: string;
  weeklyTimetable: [IDailyTimetable];
  status?: Status;
  capacity: number;
  classType: ClassType;
  coordinate: ICoordinate;
  createdBy?: string;
  updatedBy?: string;
}
export type RoomDocument = IRoom & Document;

const roomSchema: Schema<RoomDocument> = new Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    department: {
      type: String,
      required: true,
    },
    weeklyTimetable: {
      type: [Array],
      required: true,
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
    },
    coordinate: {
      type: Object,
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
