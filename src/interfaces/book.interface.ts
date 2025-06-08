import { Document, Types } from "mongoose";

export interface IBook extends Document {
  _id?: Types.ObjectId;
  title: string;
  author: string;
  genre: string;
  publicationYear?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
