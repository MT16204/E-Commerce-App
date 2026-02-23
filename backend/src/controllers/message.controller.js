import { Message } from "../models/message.model.js";

export const getChatHistory = async (req, res) => {
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
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const deleteChatHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;
    await Message.deleteMany({
      $or: [{ senderId: clerkId }, { receiverId: clerkId }],
    });
    res.status(200).json({ message: "Chat history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
