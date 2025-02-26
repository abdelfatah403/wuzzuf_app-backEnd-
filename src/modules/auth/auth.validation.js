import Joi from "joi";
import { generalRule } from "../../middlewares/validation.middleware.js";

export const SignUpSchema = Joi.object({
  firstName: generalRule.firstName.required(),
  lastName: generalRule.lastName.required(),
  email: generalRule.email.required(),
  password: generalRule.password.required(),
  cPassword: generalRule.cPassword,
  gender: generalRule.gender,
  phone: generalRule.phone.required(),
  DOB: generalRule.dateOfBirth.required(),
  file: generalRule.files,
}).required();

export const confirmEmail = Joi.object({
  email: generalRule.email.required(),
  otp: generalRule.otp.required(),
}).required();


export const LoginSchema = Joi.object({
  email: generalRule.email.required(),
  password: generalRule.password.required(),
}).required();


export const refreshtokenSchema = Joi.object({
  refreshtoken:generalRule.RefreshToken.required()
}).required();

export const forgetPassword = Joi.object({
  email: generalRule.email.required(),
}).required();

export const resetPassword = Joi.object({
  email: generalRule.email.required(),
  otp: generalRule.otp.required(),
  password: generalRule.password.required(),
}).required();
