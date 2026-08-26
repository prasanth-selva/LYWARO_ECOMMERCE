import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getMe);
router.put("/profile", authenticateUser, updateProfile);
router.put("/change-password", authenticateUser, changePassword);

export default router;
