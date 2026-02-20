import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Notification } from "../models/notification.model.js";

export async function createOrder(req, res) {
  const user = req.user;
  console.log("--- START DEBUG CREATE ORDER ---");
  console.log("👤 User ClerkId:", user?.clerkId);

  try {
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (paymentResult?.id) {
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentResult.id,
      });
      if (existingOrder) {
        console.log("⚠️ DUPLICATE DETECTED: Order already created by Webhook.");

        await triggerNotification(req, user, existingOrder, totalPrice);

        return res
          .status(200)
          .json({ message: "Order already exists", order: existingOrder });
      }
    }

    const order = new Order({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice: Number(totalPrice).toFixed(2),
    });

    await order.save();
    console.log("✅ NEW ORDER SAVED TO DB:", order._id);

    await triggerNotification(req, user, order, totalPrice);

    // Update Stock...
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("🔥 ERROR IN CREATE ORDER:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function triggerNotification(req, user, order, totalPrice) {
  console.log("--- RUNNING NOTIFICATION LOGIC ---");

  try {
    const notif = await Notification.create({
      clerkId: user.clerkId,
      title: "Order Successful!",
      message: `Order #${order._id.toString().slice(-8).toUpperCase()} received.`,
      type: "ORDER_CREATED",
      order: order._id,
    });
    console.log("📍 STEP 1: Notification saved to DB. ID:", notif._id);

    const io = req.app.get("socketio");
    if (!io) {
      console.log(
        "❌ STEP 2 ERROR: Socket.io instance not found in app configuration!",
      );
      return;
    }
    console.log("📍 STEP 2: Socket instance OK");

    console.log(`📍 STEP 3: Emitting to Room: ${user.clerkId}`);
    io.to(user.clerkId).emit("notification", {
      title: "Order Successful! 🛒",
      message: `Total: $${totalPrice}`,
      type: "ORDER_CREATED",
      order: order,
    });
    console.log("🚀 FINAL STEP: .emit() command executed successfully");
  } catch (err) {
    console.error("❌ ERROR DURING NOTIFICATION CREATION:", err.message);
  }
}

export async function getUserOrders(req, res) {
  try {
    const { status } = req.query;
    let query = { clerkId: req.user.clerkId };

    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    const orderIds = orders.map((order) => order._id);
    const reviews = await Review.find({ orderId: { $in: orderIds } });

    const ordersWithReviews = orders.map((order) => {
      const orderReviews = reviews.filter(
        (r) => r.orderId.toString() === order._id.toString(),
      );

      return {
        ...order.toObject(),
        hasReviewed: orderReviews.length > 0,
        reviews: orderReviews.map((r) => ({
          productId: r.productId.toString(),
          rating: r.rating,
        })),
      };
    });

    res.status(200).json({ orders: ordersWithReviews });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateData = { status };
    if (status === "shipped") updateData.shippedAt = Date.now();
    if (status === "delivered") updateData.deliveredAt = Date.now();

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Status updated successfully", order });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
