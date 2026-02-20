import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
