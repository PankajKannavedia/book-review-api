import { Document, Types } from "mongoose";

export interface IReview extends Document {
  _id?: Types.ObjectId;
  book: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
