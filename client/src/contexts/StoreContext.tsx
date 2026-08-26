import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import cartService from "@/services/cartService";
import wishlistService from "@/services/wishlistService";
import productService from "@/services/productService";

export type Product = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  tone: string;
  description: string;
  shortDescription?: string;
  specs: string[];
  accent: string;
  gender?: string;
  colors?: string[];
  sizes?: number[];
  images?: string[];
  model3D?: string;
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  rating?: number;
  reviewCount?: number;
};

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type StoreContextValue = {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  wishlistProducts: Product[];
  addToCart: (product: Product, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  setProducts: (products: Product[]) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

// Tone mapping from product colors
function getTone(colors: string[]): string {
  const colorMap: Record<string, string> = {
    Carbon: "carbon",
    Bone: "bone",
    Smoke: "smoke",
    Black: "black",
    Graphite: "carbon",
    White: "bone",
    Mineral: "black",
    Red: "carbon",
    Pink: "bone",
    Citron: "carbon",
  };
  return colors?.[0] ? colorMap[colors[0]] || "carbon" : "carbon";
}

function getAccent(colors: string[]): string {
  const accentMap: Record<string, string> = {
    Carbon: "#D7F54A",
    Bone: "#B7B3A8",
    Smoke: "#7C8179",
    Black: "#EAE8E1",
    Graphite: "#B7B3A8",
    White: "#EAE8E1",
    Mineral: "#EAE8E1",
    Red: "#D7F54A",
    Pink: "#B7B3A8",
    Citron: "#D7F54A",
  };
  return colors?.[0] ? accentMap[colors[0]] || "#D7F54A" : "#D7F54A";
}

function getColorStr(colors: string[]): string {
  return colors?.join(" / ") || "Black";
}

// Transform backend product to frontend-compatible format
function transformProduct(p: any): Product {
  return {
    ...p,
    id: p._id || p.id,
    tone: getTone(p.colors || []),
    color: getColorStr(p.colors || []),
    accent: getAccent(p.colors || []),
    specs: p.specifications || p.specs || [],
    category: p.category === "sneakers" ? "Everyday / Core"
      : p.category === "running" ? "Run / Performance"
      : p.category === "lifestyle" ? "Move / Lifestyle"
      : p.category === "training" ? "Train / Athletic"
      : p.category,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [products, setProductsState] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  const refreshProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts({ limit: 50 });
      const transformed = res.data.products.map(transformProduct);
      setProductsState(transformed);
    } catch {
      // If API is not available, use empty array
      setProductsState([]);
    }
  }, []);

  // Fetch cart from API
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    try {
      const res = await cartService.getCart();
      setCart(res.data.cart.items || []);
    } catch {
      setCart([]);
    }
  }, [isAuthenticated]);

  // Fetch wishlist from API
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistProducts([]);
      return;
    }
    try {
      const res = await wishlistService.getWishlist();
      const items = res.data.wishlist || [];
      setWishlist(items.map((p: any) => p._id));
      setWishlistProducts(items.map(transformProduct));
    } catch {
      setWishlist([]);
      setWishlistProducts([]);
    }
  }, [isAuthenticated]);

  // Load data on mount and auth changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshProducts();
      if (isAuthenticated) {
        await Promise.all([refreshCart(), refreshWishlist()]);
      }
      setLoading(false);
    };
    load();
  }, [isAuthenticated, refreshProducts, refreshCart, refreshWishlist]);

  // Cart actions
  const addToCart = useCallback(
    async (product: Product, size = "09", color = "") => {
      if (!isAuthenticated) {
        // For non-authenticated users, add to local cart
        setCart((prev) => {
          const existing = prev.find(
            (item) => (item.product._id || item.product.id) === (product._id || product.id) && item.size === size
          );
          if (existing) {
            return prev.map((item) =>
              item._id === existing._id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [
            ...prev,
            {
              _id: `local_${Date.now()}`,
              product,
              quantity: 1,
              size,
              color,
            },
          ];
        });
        return;
      }

      try {
        await cartService.addToCart({
          productId: product._id || product.id,
          quantity: 1,
          size,
          color,
        });
        await refreshCart();
      } catch (error: any) {
        throw error;
      }
    },
    [isAuthenticated, refreshCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (itemId.startsWith("local_")) {
        setCart((prev) => prev.filter((item) => item._id !== itemId));
        return;
      }
      try {
        await cartService.removeItem(itemId);
        await refreshCart();
      } catch {
        // ignore
      }
    },
    [refreshCart]
  );

  const setQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (itemId.startsWith("local_")) {
        setCart((prev) =>
          quantity <= 0
            ? prev.filter((item) => item._id !== itemId)
            : prev.map((item) => (item._id === itemId ? { ...item, quantity } : item))
        );
        return;
      }
      try {
        if (quantity <= 0) {
          await cartService.removeItem(itemId);
        } else {
          await cartService.updateItem(itemId, quantity);
        }
        await refreshCart();
      } catch {
        // ignore
      }
    },
    [refreshCart]
  );

  // Wishlist action
  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) return;

      try {
        if (wishlist.includes(productId)) {
          await wishlistService.removeFromWishlist(productId);
        } else {
          await wishlistService.addToWishlist(productId);
        }
        await refreshWishlist();
      } catch {
        // ignore
      }
    },
    [isAuthenticated, wishlist, refreshWishlist]
  );

  const setProducts = useCallback((prods: Product[]) => {
    setProductsState(prods.map(transformProduct));
  }, []);

  const value = useMemo(
    () => ({
      products,
      cart,
      wishlist,
      wishlistProducts,
      addToCart,
      removeFromCart,
      setQuantity,
      toggleWishlist,
      refreshCart,
      refreshWishlist,
      refreshProducts,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
      loading,
      setProducts,
    }),
    [products, cart, wishlist, wishlistProducts, addToCart, removeFromCart, setQuantity, toggleWishlist, refreshCart, refreshWishlist, refreshProducts, loading, setProducts]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
