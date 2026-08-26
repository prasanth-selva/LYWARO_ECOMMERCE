import crypto from "crypto";
import Order from "../models/Order.js";
import { AppError } from "../middleware/errorHandler.js";

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) throw new AppError("Order ID is required", 400);

    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.user.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    if (order.paymentStatus === "paid") {
      throw new AppError("Order already paid", 400);
    }

    // Razorpay integration
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

    if (razorpayKeyId) {
      // Live Razorpay flow
      // In production, use the Razorpay SDK here:
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: process.env.RAZORPAY_KEY_SECRET });
      // const paymentOrder = await razorpay.orders.create({ amount: order.total * 100, currency: 'INR', receipt: order._id.toString() });
      // return res.json({ success: true, data: { razorpayOrderId: paymentOrder.id, amount: paymentOrder.amount, currency: paymentOrder.currency, keyId: razorpayKeyId } });
    }

    // Test/sandbox mode
    res.json({
      success: true,
      data: {
        orderId: order._id,
        amount: order.total,
        currency: "INR",
        testMode: !razorpayKeyId,
        keyId: razorpayKeyId || "test_key",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId) throw new AppError("Order ID is required", 400);

    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.user.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpaySecret && paymentId && signature) {
      // Verify Razorpay signature
      const expectedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (expectedSignature !== signature) {
        throw new AppError("Payment verification failed", 400);
      }
    }

    // Mark order as paid
    order.paymentStatus = "paid";
    order.transactionId = paymentId || `test_${Date.now()}`;
    await order.save();

    res.json({
      success: true,
      data: {
        order,
        message: "Payment verified successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};
