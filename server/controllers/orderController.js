import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { AppError } from "../middleware/errorHandler.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = "razorpay" } = req.body;

    if (!shippingAddress) {
      throw new AppError("Shipping address is required", 400);
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Validate all items and calculate prices server-side
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id || item.product);

      if (!product) {
        throw new AppError(
          `Product ${product?.name || "unknown"} not found`,
          400
        );
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name} (size ${item.size})`,
          400
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingFee = subtotal >= 5000 ? 0 : 199;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      orderStatus: "confirmed",
      paymentStatus: "pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("items.product");

    res.json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product"
    );

    if (!order) throw new AppError("Order not found", 404);

    // Users can only access their own orders
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new AppError("Not authorized", 403);
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select("orderStatus shippingAddress createdAt items")
      .populate("items.product", "name");

    if (!order) throw new AppError("Order not found", 404);

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

// Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
    } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("user", "name email")
        .populate("items.product", "name"),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid order status", 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true }
    );

    if (!order) throw new AppError("Order not found", 404);

    // If cancelled, restore stock
    if (status === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};
