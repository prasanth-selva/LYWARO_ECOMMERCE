import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { AppError } from "../middleware/errorHandler.js";

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color = "" } = req.body;

    if (!productId || !size) {
      throw new AppError("Product ID and size are required", 400);
    }

    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    // Validate stock
    if (product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    // Validate size
    if (!product.sizes.includes(Number(size))) {
      throw new AppError("Invalid size", 400);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    const item = cart.items.id(itemId);
    if (!item) throw new AppError("Cart item not found", 404);

    // Validate stock
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = [];
    await cart.save();

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};
