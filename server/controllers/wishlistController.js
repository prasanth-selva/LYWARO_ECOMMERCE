import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ success: true, data: { wishlist: user.wishlist } });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate("wishlist");
    res.json({ success: true, data: { wishlist: user.wishlist } });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    await user.populate("wishlist");
    res.json({ success: true, data: { wishlist: user.wishlist } });
  } catch (error) {
    next(error);
  }
};
