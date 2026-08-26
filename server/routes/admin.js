import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/adminController.js";
import { authenticateUser, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticateUser, requireAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);

export default router;
