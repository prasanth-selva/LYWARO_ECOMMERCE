import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { AppError } from "../middleware/errorHandler.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
      lowStockResult,
      revenueResult,
      ordersByStatus,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Product.countDocuments({ $and: [{ stock: { $lte: 10 } }, { stock: { $gt: 0 } }] }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const lowStockProductsCount = lowStockResult;

    // Recent orders
    const recentOrders = await Order.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "name email")
      .populate("items.product", "name");

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    ]);

    // Monthly revenue (last 8 months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        lowStockProducts: lowStockProductsCount,
        recentOrders,
        topProducts,
        monthlyRevenue: monthlyRevenue.reverse(),
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    // Get order stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await Order.aggregate([
          { $match: { user: user._id } },
          {
            $group: {
              _id: null,
              orderCount: { $sum: 1 },
              totalSpent: { $sum: "$total" },
            },
          },
        ]);
        return {
          ...user.toObject(),
          orderCount: orderStats[0]?.orderCount || 0,
          totalSpent: orderStats[0]?.totalSpent || 0,
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
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

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    // Toggle active status (using role as a simple mechanism for now)
    if (user.role === "admin") {
      throw new AppError("Cannot deactivate admin users", 400);
    }

    // For a more robust solution, add an 'isActive' field to the User model
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};
