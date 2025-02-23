import mongoose, { Types, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        message: string,
        senderId: Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Chat = mongoose.model("Chat", chatSchema);