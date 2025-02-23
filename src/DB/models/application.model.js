import mongoose, { Types, Schema } from "mongoose";
import { jobStatus } from "../enums.js";

const applicationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userCV: {
      secure_url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: Object.values(jobStatus),
      default:jobStatus.pending,
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
const Application = mongoose.model("User", applicationSchema);

export default Application;
