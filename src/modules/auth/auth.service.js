import { OAuth2Client } from "google-auth-library";
import { enumProvidors, enumRole, tokenTypes } from "../../DB/enums.js";
import User from "../../DB/models/user.model.js";
import { decodeToken } from "../../middlewares/auth.middleware.js";
import cloudinary from "../../utilis/fileUpload/cloudinary.js";
import { compare } from "../../utilis/hash/hashing.js";
import { emailEvent } from "../../utilis/sendEmail/sendEmail.event.js";
import { generateToken } from "../../utilis/Token/tokens.js";

// sign up
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone, DOB } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new Error("user already exists", { cause: 401 }));
  }
  const otpExpiry = Date.now() + 10 * 60 * 1000;
  // const { secure_url, public_id } = await cloudinary.uploader.upload(
  //   req.file.path
  // );
  const create = await User.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    DOB,
    phone,
    otpExpiry: otpExpiry,
  });
  emailEvent.emit("sendEmail", email, firstName);
  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: create,
  });
};
// confirm email
export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (user.isConfirmed) {
    return next(new Error("user already confirmed", { cause: 401 }));
  }
  const isMatch = await compare({
    plainText: otp,
    hashPassword: user.otp,
  });
  if (!isMatch) {
    return next(new Error("otp is not correct", { cause: 401 }));
  }
  if (user.otpExpiry < Date.now()) {
    return next(new Error("otp is expired", { cause: 401 }));
  }
  user.isConfirmed = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "User confirmed successfully",
  });
};
// login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (!user.isConfirmed) {
    return next(new Error("user not confirmed", { cause: 401 }));
  }
  const isMatch = await compare({
    plainText: password,
    hashPassword: user.password,
  });
  if (!isMatch) {
    return next(new Error("password is not correct", { cause: 401 }));
  }
  if (user.isBanned) {
    return next(new Error("user is banned", { cause: 401 }));
  }
  if (user.provider === "google") {
    return next(new Error("user is logged in with google", { cause: 401 }));
  }
  const RefreshToken = generateToken(
    { id: user._id, role: user.role },
    user.role === enumRole.user
      ? process.env.USER_REFRESH_TOKEN
      : ADMIN_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
  const AccessToken = generateToken(
    { id: user._id, role: user.role },
    user.role === enumRole.user
      ? process.env.USER_ACCESS_TOKEN
      : ADMIN_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      AccessToken,
      RefreshToken,
    },
  });
};
// refresh token
export const RefreshToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodeToken({
    authorization,
    tokenType: tokenTypes.refresh,
    next,
  });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  const access_Token = generateToken(
    { id: user._id },
    user.role == enumRole.user
      ? process.env.USER_ACCESS_TOKEN
      : process.env.ADMIN_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );
  const refresh_Token = generateToken(
    { id: user._id },
    user.role == enumRole.user
      ? process.env.USER_REFRESH_TOKEN
      : process.env.ADMIN_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
  return res.status(200).json({
    success: true,
    message: "token generated successfully",
    data: {
      access_Token,
      refresh_Token,
    },
  });
};
// login and signup with google
export const LoginAndSignupWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { name, email, email_verified, family_name, picture } = await verify();

  if (!email_verified) {
    return next(new Error("Email not verified", { cause: 400 }));
  }
  let user = await User.findOne({ email });
  if (user?.provider == enumProvidors.local) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  if (!user) {
    user = await User.create({
      firstName: name,
      lastName: family_name,
      email,
      provider: enumProvidors.google,
      avatar: picture,
    });
  }
  const RefreshToken = generateToken(
    { id: user._id, role: user.role },
    user.role === enumRole.user
      ? process.env.USER_REFRESH_TOKEN
      : ADMIN_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
  const AccessToken = generateToken(
    { id: user._id, role: user.role },
    user.role === enumRole.user
      ? process.env.USER_ACCESS_TOKEN
      : ADMIN_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      AccessToken,
      RefreshToken,
    },
  });
};

// forget password
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (!user.isConfirmed) {
    return next(new Error("user not confirmed", { cause: 401 }));
  }
  if (user.provider === "google") {
    return next(new Error("user is logged in with google", { cause: 401 }));
  }
  const otpExpiry = Date.now() + 10 * 60 * 1000;
  user.otpExpiry = otpExpiry;
  await user.save();
  emailEvent.emit("forgetPassword", email, user.firstName);
  return res.status(200).json({
    success: true,
    message: "otp sent successfully",
  });
};

// reset password

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (!user.isConfirmed) {
    return next(new Error("user not confirmed", { cause: 401 }));
  }
  if (user.provider === "google") {
    return next(new Error("user is logged in with google", { cause: 401 }));
  }
  if (user.otpExpiry < Date.now()) {
    return next(new Error("otp is expired", { cause: 401 }));
  }
  const isMatch = await compare({
    plainText: otp,
    hashPassword: user.otp,
  });
  if (!isMatch) {
    return next(new Error("otp is not correct", { cause: 401 }));
  }
  user.password = password;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "password reset successfully",
  });
};



