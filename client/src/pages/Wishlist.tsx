import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Heart, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Header } from "@/components/StoreChrome";
import { toast } from "sonner";

export default function Wishlist() {
  const { isAuthenticated, loading } = useAuth();
  const { wishlistProducts, toggleWishlist, addToCart } = useStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/shop" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Back
          </Link>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            Saved
          </h1>

          {wishlistProducts.length === 0 ? (
            <div className="mt-12 border border-dashed border-[#111211]/20 py-24 text-center">
              <Heart className="mx-auto text-[#111211]/30" size={32} />
              <p className="mt-5 font-display text-2xl">Nothing saved yet.</p>
              <p className="mt-2 max-w-[280px] mx-auto text-sm text-[#111211]/50">Save pieces that catch your eye. They'll be here when you're ready.</p>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 border-b border-[#111211] pb-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                Discover <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistProducts.map((product) => (
                <div key={product._id || product.id} className="group">
                  <div className="relative aspect-square overflow-hidden bg-[#D8D6CE]">
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="h-24 w-36 -rotate-12 rounded-[45%] bg-[#1B1E1B] shadow-[12px_9px_0_#C5C4BB]" />
                    </div>
                    <button onClick={() => toggleWishlist(product._id || product.id)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-red-500 bg-red-500 text-white">
                      <Heart size={15} fill="currentColor" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/product/${product._id || product.id}`}>
                          <h3 className="font-display text-sm font-semibold hover:underline">{product.name}</h3>
                        </Link>
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#111211]/50">{product.category}</p>
                      </div>
                      <p className="font-mono text-xs">₹{product.price.toLocaleString()}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => { addToCart(product); toast.success("Added to bag"); }} className="flex items-center gap-1.5 border border-[#111211]/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition hover:bg-[#111211] hover:text-[#EAE8E1]">
                        <Plus size={11} /> Add to bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
