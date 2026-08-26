import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { Link, useRoute } from "wouter";
import ModelViewer from "@/components/ModelViewer";
import { CartDrawer, Header } from "@/components/StoreChrome";
import { useStore } from "@/contexts/StoreContext";
import productService from "@/services/productService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const { products, addToCart, wishlist, toggleWishlist } = useStore();
  const { isAuthenticated } = useAuth();
  const [size, setSize] = useState("09");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [details, setDetails] = useState("description");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [fetchedProduct, setFetchedProduct] = useState<any>(null);

  // Try to find product from context first, then fetch by slug/id
  const product = fetchedProduct || (products.find(
    (item) =>
      item.slug === params?.id ||
      item._id === params?.id ||
      item.id === params?.id
  ) ?? products[0]);

  useEffect(() => {
    if (!product && params?.id) {
      productService
        .getProductBySlug(params.id)
        .then((res) => {
          setFetchedProduct(res.data.product);
          setLoadingProduct(false);
        })
        .catch(() => {
          // Try by ID
          productService
            .getProductById(params.id)
            .then((res) => {
              setFetchedProduct(res.data.product);
            })
            .catch(() => {})
            .finally(() => setLoadingProduct(false));
        });
    } else {
      setLoadingProduct(false);
    }
  }, [params?.id, product]);

  if (!product) return null;

  const productId = product._id || product.id;
  const saved = wishlist.includes(productId);
  const sizes = product.sizes || ["07", "08", "09", "10", "11", "12"];
  const specs = product.specifications || product.specs || [];

  const addProduct = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product, size);
    }
    toast.success("Added to bag");
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => setCartOpen(true)} />
      <main className="px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 transition hover:text-[#111211]"
          >
            <ArrowLeft size={13} /> Back to collection
          </Link>
          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative min-h-[600px] overflow-hidden bg-[#111211] lg:sticky lg:top-24 lg:h-[calc(100vh-150px)] lg:min-h-[650px]">
              <ModelViewer />
              <div className="absolute left-6 top-6 pointer-events-none">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D7F54A]">
                  {product.name?.split(" ").pop() || "APEX"} / 001
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                  Interactive product view
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center lg:py-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#111211]/45">
                    {product.category}
                  </p>
                  <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.88] tracking-[-0.06em] sm:text-7xl">
                    LYWARO
                    <br />
                    <span className="text-[#111211]/40">
                      {product.name?.replace("LYWARO ", "").toUpperCase()}
                    </span>
                  </h1>
                </div>
                <button
                  onClick={() => isAuthenticated && toggleWishlist(productId)}
                  aria-label={`${saved ? "Remove" : "Add"} from wishlist`}
                  className={`grid h-11 w-11 shrink-0 place-items-center border ${saved ? "border-[#D7F54A] bg-[#D7F54A]" : "border-[#111211]/20"}`}
                >
                  <Heart
                    size={17}
                    fill={saved ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
              <div className="mt-7 flex items-center gap-4">
                <p className="font-mono text-lg">
                  ₹{product.price.toLocaleString()}
                </p>
                {product.compareAtPrice > 0 && (
                  <p className="font-mono text-sm text-[#111211]/40 line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </p>
                )}
                <span className="h-1 w-1 rounded-full bg-[#D7F54A]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/45">
                  {product.color || product.colors?.join(" / ")}
                </p>
              </div>
              <p className="mt-8 max-w-[430px] text-base leading-7 text-[#111211]/60">
                {product.description || product.shortDescription} Built for
                the quiet confidence of everyday movement.
              </p>
              <div className="mt-9 border-t border-[#111211]/15 pt-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
                    Select size
                  </p>
                  <button className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 underline underline-offset-4">
                    Size guide
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {sizes.map((s: any) => {
                    const sizeStr = String(s);
                    return (
                      <button
                        key={sizeStr}
                        onClick={() => setSize(sizeStr)}
                        className={`h-11 border font-mono text-xs transition ${size === sizeStr ? "border-[#111211] bg-[#111211] text-[#EAE8E1]" : "border-[#111211]/15 hover:border-[#111211]/50"}`}
                      >
                        {sizeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <div className="flex h-14 items-center border border-[#111211]/20">
                  <button
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid h-full w-11 place-items-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((value) => value + 1)}
                    className="grid h-full w-11 place-items-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={addProduct}
                  className="flex flex-1 items-center justify-between bg-[#111211] px-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]"
                >
                  <span>Add to bag</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
              <Link
                href={isAuthenticated ? "/checkout" : "/login"}
                className="mt-3 block w-full border border-[#111211]/20 py-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-[#111211]"
              >
                Buy now
              </Link>
              <div className="mt-9 grid grid-cols-2 gap-3 border-y border-[#111211]/15 py-5">
                <div className="flex gap-3">
                  <Truck size={17} strokeWidth={1.2} />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em]">
                      Dispatch
                    </p>
                    <p className="mt-1 text-xs text-[#111211]/50">
                      Free shipping on ₹5,000+
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck size={17} strokeWidth={1.2} />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em]">
                      Returns
                    </p>
                    <p className="mt-1 text-xs text-[#111211]/50">
                      30-day returns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-7 divide-y divide-[#111211]/15 border-b border-[#111211]/15">
                {[
                  ["description", "Description"],
                  ["specifications", "Specifications"],
                  ["shipping", "Shipping & returns"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <button
                      onClick={() => setDetails(details === key ? "" : key)}
                      className="flex w-full items-center justify-between py-5 text-left font-mono text-[10px] uppercase tracking-[0.16em]"
                    >
                      <span>{label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition ${details === key ? "rotate-180" : ""}`}
                      />
                    </button>
                    {details === key && (
                      <div className="pb-5 text-sm leading-6 text-[#111211]/55">
                        {key === "description" && (
                          <p>
                            {product.description ||
                              "Precision-inspired in proportion and uncomplicated in use. A breathable upper, a flexible base, and a silhouette that settles naturally into the everyday."}
                          </p>
                        )}
                        {key === "specifications" && (
                          <ul className="space-y-2">
                            {specs.map((spec: string) => (
                              <li
                                key={spec}
                                className="flex items-center gap-2"
                              >
                                <Check
                                  size={13}
                                  className="text-[#111211]"
                                />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        )}
                        {key === "shipping" && (
                          <p>
                            Complimentary standard shipping on orders above
                            ₹5,000. Returns accepted within 30 days of
                            delivery in original condition.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]"
              >
                Explore the rest of the collection{" "}
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
