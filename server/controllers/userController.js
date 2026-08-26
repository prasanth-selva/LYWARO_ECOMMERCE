import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    // If setting as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(req.body);
    await user.save();

    res
      .status(201)
      .json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) throw new AppError("Address not found", 404);

    // If setting as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );

    // If deleted address was default, make first remaining one default
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};
