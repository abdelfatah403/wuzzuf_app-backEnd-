import mongoose, { Types, Schema } from "mongoose";
import { jobLocation, workingTime } from "../enums.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
    },
    jobLocation: {
      type: String,
    },
    workingTime: {
      type: String,
    },
    seniorityLevel: {
      type: String,
      
    },
    jobDescription : {
      type: String,
     
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    technicalSkills:[String],
    softSkills :[String],
    updatedBy : {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    closed : {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);



const Job = mongoose.model("Job", jobSchema);

export default Job;
