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
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfEmployees: {
      type: String,
      required: true,
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
    Logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: [String],
    HRs: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
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


const Company = mongoose.model("Company", CompanySchema);

export default Company;
