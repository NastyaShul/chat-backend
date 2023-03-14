import Joi from "joi";

export const chatRoomSchema = Joi.object({
   name: Joi.string().min(2).max(30).required(),

   description: Joi.string().min(2).max(255),

   participants: Joi.array(),

   messages: Joi.array()
});

export const chatRoomUpdateSchema = Joi.object({
   name: Joi.string().min(2).max(30),

   description: Joi.string().min(2).max(255),
});