import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Cart from "./models/Cart.js";

const products = [
  {
    name: "LYWARO APEX",
    slug: "lywaro-apex",
    description:
      "A considered, everyday silhouette with a precise point of view. The APEX is built around the balance between quiet confidence and everyday performance.",
    shortDescription: "Everyday silhouette, precise point of view.",
    price: 4999,
    compareAtPrice: 5999,
    category: "sneakers",
    gender: "unisex",
    brand: "LYWARO",
    colors: ["Carbon", "Citron"],
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    images: ["/products/apex.svg"],
    model3D: "/models/lywaro-apex.glb",
    stock: 150,
    featured: true,
    bestseller: true,
    newArrival: false,
    specifications: [
      "Lightweight construction",
      "Responsive cushioning",
      "Breathable upper",
      "Everyday performance",
    ],
    tags: ["everyday", "core", "sneaker", "performance"],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: "LYWARO VECTOR",
    slug: "lywaro-vector",
    description:
      "A light, directional runner for the daily distance. Streamlined construction meets cushioned comfort for the runner who values both form and function.",
    shortDescription: "Directional runner for the daily distance.",
    price: 5499,
    compareAtPrice: 6299,
    category: "running",
    gender: "unisex",
    brand: "LYWARO",
    colors: ["Bone", "Graphite"],
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    images: ["/products/vector.svg"],
    model3D: "",
    stock: 95,
    featured: true,
    bestseller: false,
    newArrival: true,
    specifications: [
      "Streamlined upper",
      "Cushioned footbed",
      "Reflective detail",
      "Lace-lock system",
    ],
    tags: ["running", "performance", "lightweight"],
    rating: 4.6,
    reviewCount: 67,
  },
  {
    name: "LYWARO SHIFT",
    slug: "lywaro-shift",
    description:
      "An easy low profile built around the rhythm of the city. Flexible, comfortable, and designed to move with you from morning to night.",
    shortDescription: "Low profile for the city rhythm.",
    price: 4499,
    compareAtPrice: 5299,
    category: "lifestyle",
    gender: "unisex",
    brand: "LYWARO",
    colors: ["Smoke", "Bone"],
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    images: ["/products/shift.svg"],
    model3D: "",
    stock: 120,
    featured: true,
    bestseller: false,
    newArrival: false,
    specifications: [
      "Low-profile shape",
      "Flexible outsole",
      "Soft collar",
      "All-day comfort",
    ],
    tags: ["lifestyle", "comfort", "everyday"],
    rating: 4.5,
    reviewCount: 89,
  },
  {
    name: "LYWARO CORE",
    slug: "lywaro-core",
    description:
      "The essential silhouette, reduced to what matters. Clean construction, minimal branding, and durable rubber make this the foundation of any rotation.",
    shortDescription: "Essential silhouette, reduced to what matters.",
    price: 3999,
    compareAtPrice: 4499,
    category: "sneakers",
    gender: "unisex",
    brand: "LYWARO",
    colors: ["Black", "Mineral"],
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    images: ["/products/core.svg"],
    model3D: "",
    stock: 200,
    featured: false,
    bestseller: true,
    newArrival: false,
    specifications: [
      "Clean construction",
      "Minimal branding",
      "Durable rubber",
      "Easy everyday wear",
    ],
    tags: ["essential", "minimal", "everyday"],
    rating: 4.7,
    reviewCount: 156,
  },
  {
    name: "LYWARO SURGE",
    slug: "lywaro-surge",
    description:
      "Engineered for explosive movement. The SURGE combines responsive foam with a dynamic upper for athletes who push boundaries.",
    shortDescription: "Explosive movement, responsive foam.",
    price: 5999,
    compareAtPrice: 0,
    category: "training",
    gender: "men",
    brand: "LYWARO",
    colors: ["Black", "Red"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    images: ["/products/surge.svg"],
    model3D: "",
    stock: 75,
    featured: true,
    bestseller: false,
    newArrival: true,
    specifications: [
      "Dynamic foam",
      "Reinforced heel",
      "Agile traction",
      "Performance fit",
    ],
    tags: ["training", "performance", "athletic"],
    rating: 4.4,
    reviewCount: 42,
  },
  {
    name: "LYWARO DRIFT",
    slug: "lywaro-drift",
    description:
      "Effortless style meets all-day comfort. The DRIFT is designed for those who move between work, leisure, and everything in between.",
    shortDescription: "Effortless style meets all-day comfort.",
    price: 4299,
    compareAtPrice: 0,
    category: "lifestyle",
    gender: "women",
    brand: "LYWARO",
    colors: ["White", "Pink"],
    sizes: [35, 36, 37, 38, 39, 40, 41, 42],
    images: ["/products/drift.svg"],
    model3D: "",
    stock: 110,
    featured: false,
    bestseller: false,
    newArrival: true,
    specifications: [
      "Soft textile upper",
      "Cloud cushion",
      "Slip-on convenience",
      "Versatile style",
    ],
    tags: ["lifestyle", "comfort", "versatile"],
    rating: 4.3,
    reviewCount: 38,
  },
];

const adminEmail = process.env.ADMIN_EMAIL || "admin@lywaro.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);

    console.log("Cleared existing data");

    // Create admin user
    const admin = await User.create({
      name: "LYWARO Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Admin created: ${adminEmail}`);

    // Create test user
    const testUser = await User.create({
      name: "Test User",
      email: "user@lywaro.com",
      password: "user123",
      role: "user",
      addresses: [
        {
          fullName: "Test User",
          phone: "+91 98765 43210",
          addressLine1: "42 Movement Lane",
          addressLine2: "Apartment 5B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
          isDefault: true,
        },
      ],
    });
    console.log("Test user created: user@lywaro.com");

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded`);

    console.log("\n--- Seed Complete ---");
    console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
    console.log(`User login:  user@lywaro.com / user123`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
