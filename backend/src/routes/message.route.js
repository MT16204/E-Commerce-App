import express from "express";
import { Message } from "../models/message.model.js";
import { protectRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// --- ADMIN ---
router.get("/admin/chat/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: clerkId, receiverId: "ADMIN" },
        { senderId: "ADMIN", receiverId: clerkId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/admin/chat/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    await Message.deleteMany({
      $or: [
        { senderId: clerkId, receiverId: "ADMIN" },
        { senderId: "ADMIN", receiverId: clerkId },
      ],
    });
    res.status(200).json({ message: "Chat history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- USER (MOBILE) ---
router.get("/user/history", protectRoute, async (req, res) => {
  try {
    const userId = req.user.clerkId;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: "ADMIN" },
        { senderId: "ADMIN", receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

export default router;
