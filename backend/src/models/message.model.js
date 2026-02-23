import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true }, 
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, 
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
