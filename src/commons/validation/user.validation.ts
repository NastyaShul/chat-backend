import Joi from "joi";

export const userRegisterSchema = Joi.object({
   username: Joi.string().pattern(new RegExp("^^[A-Z]+[a-z]+$")).min(2).max(30).required(),

   password: Joi.string().pattern(new RegExp("(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]")).min(6).required(),

   email: Joi.string().email().pattern(new RegExp("^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+\.[a-z0-9-.]+$")).min(3).max(255).required(),
});

export const userUpdateSchema = Joi.object({
   username: Joi.string().pattern(new RegExp("^^[A-Z]+[a-z]+$")).min(2).max(30),

   password: Joi.string().pattern(new RegExp("(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]")).min(6),

   email: Joi.string().email().pattern(new RegExp("^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+\.[a-z0-9-.]+$")).min(3).max(255),
})
