import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "@/interfaces/users.interface";
import { IBook } from "@/interfaces/book.interface";

@modelOptions({ schemaOptions: { collection: "reviews", timestamps: true } })
class Review {
  @prop({ type: Types.ObjectId, ref: "IBook", required: true })
  public book!: Ref<IBook>;
  @prop({ type: Types.ObjectId, ref: "User", required: true })
  public user!: Ref<User>;
  @prop({ type: Number, required: true, min: 1, max: 5 })
  public rating: number;
  @prop({ type: String, required: true })
  public comment: string;
  @prop({ type: String })
  public created_on?: Date;
  public created_by?: string;
  public updatedAt?: Date;
}

const ReviewModel = getModelForClass(Review);
ReviewModel.schema.index({ book: 1, user: 1 }, { unique: true });

export default ReviewModel;
