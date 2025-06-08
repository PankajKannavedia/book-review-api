import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "book", timestamps: true } })
class Book {
  @prop({ type: String, required: true })
  public title: string;
  @prop({ type: String, required: true })
  public author: string;
  @prop({ type: String, required: true })
  public genre: string;
  @prop({ type: Number })
  public publicationYear: number;
  @prop({ type: String })
  public description: string;
}

const BookModel = getModelForClass(Book);
export default BookModel;
