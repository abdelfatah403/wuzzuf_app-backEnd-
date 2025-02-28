import EventEmitter from "events";
import { sendEmails } from "./sendEmail.service.js";
import { subject } from "../../DB/enums.js";
import { customAlphabet } from "nanoid";
import { hash } from "../hash/hashing.js";
import User from "../../DB/models/user.model.js";
import Application from "../../DB/models/application.model.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async (email, username) => {
  const otp = customAlphabet("1234567890", 4)();
  const hashedOtp = await hash({
    plainText: otp,
    salt: parseInt(process.env.SALT),
  });
  await User.updateOne({ email }, { otp: hashedOtp });
  await sendEmails({
    to: email,
    subject: subject.verify,
    html: `<h1>Hi ${username}</h1><p>Your OTP is ${otp}</p>`,
  });
});

emailEvent.on("forgetPassword", async (email, username) => {
  const otp = customAlphabet("1234567890", 4)();
  const hashedOtp = await hash({
    plainText: otp,
    salt: parseInt(process.env.SALT),
  });
  await User.updateOne({ email }, { otp: hashedOtp });
  await sendEmails({
    to: email,
    subject: subject.forgotPassword,
    html: `<h1>Hi ${username}</h1><p>Your OTP is ${otp}</p>`,
  });
});

emailEvent.on("accept", async (email, username) => {
  await sendEmails({
    to: email,
    subject: subject.forgotPassword,
    html: `<h1>Hi ${username}</h1><p>you are accepted</p>`,
  });
});


emailEvent.on("reject", async (email, username) => {
  await sendEmails({
    to: email,
    subject: subject.forgotPassword,
    html: `<h1>Hi ${username}</h1><p>you are rejected</p>`,
  });
});
