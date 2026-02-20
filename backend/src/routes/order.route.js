import { Router } from "express";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

// --- ROUTES USER ---
router.post("/", ...protectRoute, createOrder);
router.get("/", ...protectRoute, getUserOrders);

// ROUTES ADMIN
router.patch("/:orderId/status", ...protectRoute, adminOnly, updateOrderStatus);

export default router;
