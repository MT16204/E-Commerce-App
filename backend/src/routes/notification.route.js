import express from "express";
import {
  getMyNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js"; 
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getMyNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
