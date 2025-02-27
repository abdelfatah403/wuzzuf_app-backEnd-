import Joi from "joi";



export const companySchema = Joi.object({
    companyName: Joi.string().min(3).max(20).required(),
    companyEmail: Joi.string().email().required(),
    companyPhone: Joi.string().min(11).max(14).required(),
    address: Joi.string().min(3).max(20).required(),
    industry: Joi.string().min(3).max(500).required(),
    description: Joi.string().min(3).max(500).required(),
    files:Joi.object({
        secure_url:Joi.string(),
        public_id:Joi.string()
    }),
}).required();


export const updateCompanySchema = Joi.object({
    companyName: Joi.string().min(3).max(20),
    companyEmail: Joi.string().email(),
    companyPhone: Joi.string().min(11).max(14),
    address: Joi.string().min(3).max(20),
    industry: Joi.string().min(3).max(500),
    description: Joi.string().min(3).max(500),
    createdBy: Joi.string(),
    companyId:Joi.string().required()
})