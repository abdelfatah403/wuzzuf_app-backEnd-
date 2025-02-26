import Joi from "joi";
import { generalRule } from "../../middlewares/validation.middleware.js";

export const updateSchema = Joi.object({
  firstName: generalRule.firstName.optional(),
  lastName: generalRule.lastName.optional(),
  email: generalRule.email.optional(),
  gender: generalRule.gender.optional(),
  phone: generalRule.phone.optional(),
  DOB: generalRule.dateOfBirth.optional()
});
