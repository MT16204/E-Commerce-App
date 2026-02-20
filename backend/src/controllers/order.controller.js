import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) {
  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    // validate products and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    const io = req.app.get("socketio");
    if (io) {
      io.to(user.clerkId).emit("notification", {
        title: "Đặt hàng thành công! 🛒",
        message: `Đơn hàng của bạn đã được tiếp nhận với giá $${totalPrice}`,
        type: "ORDER_CREATED",
        orderId: order._id,
      });
    }

    // update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    res.status(500).json({ error: "Internal server error" });
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
    res.status(500).json({ error: "Internal server error" });
  }
}
