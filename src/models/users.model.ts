import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "user", timestamps: true } })
class User {
  @prop({ type: String, required: true, unique: true })
  public user_name: string;
  @prop({ type: String, required: true, unique: true })
  public email: string;
  @prop({ type: String, required: true })
  public password: string;
  @prop({ type: String, required: true })
  public full_name: string;
  @prop({ type: String })
  public role: string;
  public created_on?: Date;
  public created_by?: string;
  public updatedAt?: Date;
}

const UserModel = getModelForClass(User);

export default UserModel;

export const UserSchema = typeof User;
