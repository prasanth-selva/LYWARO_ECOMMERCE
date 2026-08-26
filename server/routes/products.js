import { Router } from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/productController.js";
import { authenticateUser, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/bestsellers", getBestsellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authenticateUser, requireAdmin, createProduct);
router.put("/:id", authenticateUser, requireAdmin, updateProduct);
router.delete("/:id", authenticateUser, requireAdmin, deleteProduct);

export default router;
