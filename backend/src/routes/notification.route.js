import express from "express";
import { getMyNotifications } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", protectRoute, getMyNotifications);

export default router;
