import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticateUser, requireAdmin } from "../middleware/auth.js";

const router = Router();

// User routes
router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getUserOrders);
router.get("/track/:id", authenticateUser, trackOrder);
router.get("/:id", authenticateUser, getOrderById);

// Admin routes
router.get("/admin/all", authenticateUser, requireAdmin, getAllOrders);
router.put(
  "/admin/:id/status",
  authenticateUser,
  requireAdmin,
  updateOrderStatus
);

export default router;
