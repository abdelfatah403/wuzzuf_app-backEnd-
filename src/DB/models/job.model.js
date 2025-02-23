import mongoose, { Types, Schema } from "mongoose";
import { jobLocation, workingTime } from "../enums.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobLocation: {
      type: String,
      trim: true,
      required: true,
      enum: Object.values(jobLocation),
      default: jobLocation.remote,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      required: true,
    },
    jobDescription : {
      type: String,
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
