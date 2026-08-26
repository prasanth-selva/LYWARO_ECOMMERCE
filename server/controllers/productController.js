import Product from "../models/Product.js";
import { AppError } from "../middleware/errorHandler.js";

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "-createdAt",
      category,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      search,
      featured,
      bestseller,
      newArrival,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (featured === "true") filter.featured = true;
    if (bestseller === "true") filter.bestseller = true;
    if (newArrival === "true") filter.newArrival = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (size) filter.sizes = { $in: Array.isArray(size) ? size.map(Number) : [Number(size)] };
    if (color) filter.colors = { $in: Array.isArray(color) ? color : [color] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
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

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new AppError("Product not found", 404);
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.find({ bestseller: true }).limit(8);
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ newArrival: true })
      .sort("-createdAt")
      .limit(8);
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

// Admin controllers
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new AppError("Product not found", 404);
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: { products: [] } });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    }).limit(20);

    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};
