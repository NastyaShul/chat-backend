import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { versionKey: false } })

export class ChatRoom {
   @prop({ id: true })
   id!: Types.ObjectId;
   
   @prop({ required: true })
   owner!: Types.ObjectId;

   @prop({ required: true })
   name!: string;

   @prop()
   description?: string;

   @prop()
   participants?: Types.ObjectId[];

   @prop()
   messages?: Types.ObjectId[];
}

export const ChatRoomModel = getModelForClass(ChatRoom);
