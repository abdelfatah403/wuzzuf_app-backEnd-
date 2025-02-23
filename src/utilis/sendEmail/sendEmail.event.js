import EventEmitter from "events";
import { sendEmails } from "./sendMail.service.js";
import { subject } from "../../DB/enums.js";
import { customAlphabet } from "nanoid";
import { hash } from "../hash/hashing.js";
import User from "../../DB/models/user.model.js";


export const emailEvent = new EventEmitter();