import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
   schemaOptions:
   {
      versionKey: false
   }
})
export class User {
   @prop({ id: true })
   id!: Types.ObjectId;

   @prop({ required: true })
   username!: string;

   @prop({ required: true })
   email!: string;

   @prop({ required: true })
   password!: string;
}

export const UserModel = getModelForClass(User);