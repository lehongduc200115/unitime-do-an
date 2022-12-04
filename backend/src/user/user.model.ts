import mongoose, { Document, Model, Schema } from 'mongoose';
import { Status } from '../common/enum';

export interface IUser {
    email: string;
    password: string;
    status?: Status;
    isVerified?: boolean;
    createdBy?: string;
    updatedBy?: string;
    isAccountOwner?: boolean;
  }
export type UserDocument = IUser & Document;

const userSchema: Schema<UserDocument> = new Schema(
  {    
    email: {
      type: String,
      required: true,      
      unique: true
    },
    password: {
      type: String,
      required: true, 
      minlength: 6
    },
    status: {
      type: String,
      default: Status.ACTIVE,
      required: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
    isAccountOwner: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.set('toObject', {
  virtuals: true
});

export const UserModel: Model<UserDocument> = mongoose.model(
  "user",
  userSchema
);
