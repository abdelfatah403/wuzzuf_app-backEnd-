import Joi from "joi";
import { generalRule } from "../../middlewares/validation.middleware.js";



export const jobSchema = Joi.object({
    jobTitle: generalRule.jobTitle.required(),
    jobDescription: generalRule.jobDescription.required(),
    jobLocation: generalRule.jobLocation.required(),
    workingTime: generalRule.workingTime.required(),
    salary: generalRule.salary,
    technicalSkills: generalRule.technicalSkills,
    seniorityLevel: generalRule.seniorityLevel.required(),
    addedBy: generalRule.addedBy,
    updatedBy: generalRule.updatedBy,
    companyId: generalRule.companyId,
  }).required();


export const updateJobSchema = Joi.object({
    jobTitle: generalRule.jobTitle,
    jobDescription: generalRule.jobDescription,
    jobLocation: generalRule.jobLocation,
    workingTime: generalRule.workingTime,
    salary: generalRule.salary,
    technicalSkills: generalRule.technicalSkills,
    seniorityLevel: generalRule.seniorityLevel,
    addedBy: generalRule.addedBy,
    updatedBy: generalRule.updatedBy,
    companyId: generalRule.companyId,
    jobId: Joi.string().min(24).max(27),
  }).required();
