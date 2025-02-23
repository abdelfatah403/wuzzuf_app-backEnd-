import Joi from "joi";
import { enumGender, enumRole } from "../DB/enums.js";
export const generalRule = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(6),
  cPassword: Joi.string().valid(Joi.ref("password")),
  gender: Joi.string().valid(enumGender.female, enumGender.male),
  phone: Joi.string().regex(/^01[0125][0-9]{8}$/),
  role: Joi.string().valid(enumRole.admin, enumRole.user),
  otp: Joi.number(),
  RefreshToken: Joi.string(),
  content: Joi.string().min(3),
  files: Joi.array().items(Joi.object({})),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const result = schema.validate(data, { abortEarly: false });
    if (result.error) {
      const error = result.error.details.map((err) => err.message);
      return res.json({ message: "validation error", error });
    } else {
      next();
    }
  };
};

export const validationGraph = async ({ schema, data } = {}) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw new Error(error.message, 400);
  }
};
