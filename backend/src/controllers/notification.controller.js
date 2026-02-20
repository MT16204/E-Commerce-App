import { Notification } from "../models/notification.model.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ clerkId: req.user.clerkId })
      .populate({
        path: "order",
        populate: { path: "orderItems.product", select: "name images" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
