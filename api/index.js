import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Routes
import authRoutes from "../server/routes/auth.js";
import productRoutes from "../server/routes/products.js";
import cartRoutes from "../server/routes/cart.js";
import wishlistRoutes from "../server/routes/wishlist.js";
import userRoutes from "../server/routes/users.js";
import orderRoutes from "../server/routes/orders.js";
import paymentRoutes from "../server/routes/payment.js";
import adminRoutes from "../server/routes/admin.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("MongoDB connected (serverless)");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — allow both local and production origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "LYWARO API is running", env: process.env.NODE_ENV || "development" });
});

// Catch-all 404 for API
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error("API Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Vercel serverless handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

// For local development
const PORT = parseInt(process.env.PORT || "5000", 10) || 5000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`LYWARO server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
}
