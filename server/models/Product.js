import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["sneakers", "running", "training", "lifestyle"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["men", "women", "unisex"],
    },
    brand: { type: String, default: "LYWARO" },
    colors: [{ type: String }],
    sizes: [{ type: Number }],
    images: [{ type: String }],
    model3D: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    specifications: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text", category: "text" });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
