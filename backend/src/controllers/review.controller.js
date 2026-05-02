import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const user = req.user;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.clerkId !== user.clerkId)
      return res
        .status(403)
        .json({ error: "Not authorized to review this order" });
    if (order.status !== "delivered")
      return res
        .status(400)
        .json({ error: "Can only review delivered orders" });

    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!productInOrder)
      return res.status(400).json({ error: "Product not found in this order" });

    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });
    const oldRating = existingReview?.rating ?? null;

    // Upsert review
    const review = await Review.findOneAndUpdate(
      { productId, userId: user._id },
      { rating, orderId, productId, userId: user._id },
      { new: true, upsert: true, runValidators: true },
    );

    if (oldRating === null) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { totalReviews: 1 },
      });
      const product = await Product.findById(productId);
      const newAverage =
        (product.averageRating * (product.totalReviews - 1) + rating) /
        product.totalReviews;
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(newAverage * 10) / 10,
      });
    } else {
      const product = await Product.findById(productId);
      const currentTotal = product.averageRating * product.totalReviews;
      const newAverage =
        (currentTotal - oldRating + rating) / product.totalReviews;
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(newAverage * 10) / 10,
      });
    }

    const orderToCheck =
      await Order.findById(orderId).populate("orderItems.product");
    const allProductIds = orderToCheck.orderItems
      .filter((item) => item.product) // guard null
      .map((item) => item.product._id.toString());

    const reviewedProductIds = await Review.find({
      productId: { $in: allProductIds },
      userId: user._id,
    }).distinct("productId");

    const allReviewed =
      allProductIds.length > 0 &&
      allProductIds.every((id) =>
        reviewedProductIds.map((r) => r.toString()).includes(id),
      );

    if (allReviewed) {
      await Order.findByIdAndUpdate(orderId, { hasReviewed: true });
    }

    const updatedProduct = await Product.findById(productId);
    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });

    const productId = review.productId;
    const deletedRating = review.rating;

    await Review.findByIdAndDelete(reviewId);

    const product = await Product.findById(productId);
    if (product && product.totalReviews > 1) {
      const newTotalReviews = product.totalReviews - 1;
      const newAverage =
        (product.averageRating * product.totalReviews - deletedRating) /
        newTotalReviews;
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(newAverage * 10) / 10,
        $inc: { totalReviews: -1 },
      });
    } else if (product) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
