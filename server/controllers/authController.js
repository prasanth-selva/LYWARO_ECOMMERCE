import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/token.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) throw new AppError("Email already in use", 400);
      user.email = email;
    }

    await user.save();
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current and new password are required", 400);
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
};
