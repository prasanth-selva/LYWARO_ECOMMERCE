// Blacktop Editorial: interaction state stays calm, useful, and commerce-first; citron is reserved for actions.
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  tone: string;
  description: string;
  specs: string[];
  accent: string;
};

export type CartItem = Product & { size: string; quantity: number };

type StoreContextValue = {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  cartTotal: number;
};

const products: Product[] = [
  {
    id: "apex",
    name: "LYWARO APEX",
    category: "Everyday / Core",
    price: 185,
    color: "Carbon / Citron",
    tone: "carbon",
    description: "A considered, everyday silhouette with a precise point of view.",
    specs: ["Lightweight construction", "Responsive cushioning", "Breathable upper", "Everyday performance"],
    accent: "#D7F54A",
  },
  {
    id: "vector",
    name: "LYWARO VECTOR",
    category: "Run / Performance",
    price: 210,
    color: "Bone / Graphite",
    tone: "bone",
    description: "A light, directional runner for the daily distance.",
    specs: ["Streamlined upper", "Cushioned footbed", "Reflective detail", "Lace-lock system"],
    accent: "#B7B3A8",
  },
  {
    id: "shift",
    name: "LYWARO SHIFT",
    category: "Move / Lifestyle",
    price: 165,
    color: "Smoke / Bone",
    tone: "smoke",
    description: "An easy low profile built around the rhythm of the city.",
    specs: ["Low-profile shape", "Flexible outsole", "Soft collar", "All-day comfort"],
    accent: "#7C8179",
  },
  {
    id: "core",
    name: "LYWARO CORE",
    category: "Form / Essential",
    price: 145,
    color: "Black / Mineral",
    tone: "black",
    description: "The essential silhouette, reduced to what matters.",
    specs: ["Clean construction", "Minimal branding", "Durable rubber", "Easy everyday wear"],
    accent: "#EAE8E1",
  },
];

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (product: Product, size = "09") => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((current) => current.filter((item) => item.id !== id));

  const setQuantity = (id: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const value = useMemo(
    () => ({
      products,
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      toggleWishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [cart, wishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
