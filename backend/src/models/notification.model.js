import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String }, 
    status: { type: String },
    orderData: {
      orderId: String,
      totalPrice: Number,
      productName: String,
      productImage: String,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
