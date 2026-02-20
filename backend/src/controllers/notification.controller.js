export const getMyNotifications = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.clerkId) {
      return res
        .status(401)
        .json({ message: "Không tìm thấy thông tin người dùng" });
    }

    console.log("Đang lấy thông báo cho ClerkID:", user.clerkId);

    const notifications = await Notification.find({ clerkId: user.clerkId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ notifications: notifications || [] });
  } catch (error) {
    console.error("Lỗi sập Server tại getMyNotifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
