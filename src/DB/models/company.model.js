import mongoose, { Types, Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    numberOfEmployees: {
      type: String,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    CreatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: [Object],
    HRs: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted:{
      type:Boolean,
      default:false
    },
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: {
      secure_url: String,
      public_id: String,
    },
    approvedByAdmin: {
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

CompanySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

const Company = mongoose.model("Company", CompanySchema);

export default Company;
