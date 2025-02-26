import mongoose, { Types, Schema } from "mongoose";
import { enumGender, enumProvidors, enumRole } from "../enums.js";
import { hash } from "../../utilis/hash/hashing.js";
import { decrypt, encrypt } from "../../utilis/encrypt/encryption.js";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: Object.values(enumGender),
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
    isActive: {
      type: Boolean,
      default: true,
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
    },
    changeCredentialTime: Date,
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    avatar: String,
    coverPic: [Object],
    otp: String,

    otpExpiry: Date,
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
    this.password = await hash({
      plainText: this.password,
      salt: parseInt(process.env.SALT),
    });
    this.phone = await encrypt(this.phone, process.env.SECRET_KEY_Phone);
  }
  next();
});

UserSchema.pre("find", function (next) {
  if (this.isModified("phone")) {
    this.phone = decrypt(this.phone, process.env.SECRET_KEY_Phone);
  }
  next();
});

UserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 6 * 60 * 60 });
UserSchema.index({ otp: 1 }, { expireAfterSeconds: 6 * 60 * 60 });
const User = mongoose.model("User", UserSchema);

export default User;
