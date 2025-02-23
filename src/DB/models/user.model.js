import mongoose, { Types, Schema } from "mongoose";
import { enumGender, enumProvidors, enumRole } from "../enums.js";
import { hash } from "../../utilis/hash/hashing.js";
import { encrypt } from "../../utilis/encrypt/encryption.js";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: Object.values(enumGender),
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(enumRole),
      default: "user",
    },
    provider: {
      type: String,
      enum: Object.values(enumProvidors),
      default: "local",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    DOB: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18 && age <= 65;
        },
        message: "Age must be between 18 and 65",

        validator: function (value) {
          return /^\d{4}-\d{1,2}-\d{1,2}$/.test(
            value.toISOString().split("T")[0]
          );
        },
        message: "Invalid date format. Please use YYYY-MM-DD.",
      },
    },
    changeCredentialTime: date,
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: [String],
    otp: [
      {
        confirmEmail: {
          type: String,
        },
        expiresIn: Date,
        forgetPassword: {
          type: String,
        },
      },
    ],
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

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isModified("phone")) {
    this.password = await hash({plainText: this.password, salt: process.env.SALT });
    this.phone = await encrypt(this.phone, process.env.SECRET_KEY_Phone);
  }
  next();
});
const User = mongoose.model("User", UserSchema);

export default User;
