import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ onCart }: { onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cartCount, wishlist } = useStore();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = ["SHOP", "MEN", "WOMEN", "NEW", "ABOUT"];
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${scrolled || location !== "/" ? "border-[#111211]/10 bg-[#EAE8E1]/90 text-[#111211] backdrop-blur-xl" : "border-white/10 bg-[#111211]/15 text-[#EAE8E1] backdrop-blur-md"}`}>
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className={`grid h-8 w-8 place-items-center border transition ${scrolled || location !== "/" ? "border-[#111211]" : "border-white/50"}`}><img src="/lywaro-logo.svg" alt="LYWARO" className="h-5 w-5 object-contain" /></span>
            <span className="font-display text-[15px] font-semibold tracking-[0.14em]">LYWΛRO</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => <Link key={item} href={item === "SHOP" ? "/shop" : item === "NEW" ? "/shop?sort=new" : "/shop"} className="font-mono text-[10px] tracking-[0.18em] opacity-65 transition hover:text-[#D7F54A] hover:opacity-100">{item}</Link>)}
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/shop" className="hidden h-10 w-10 place-items-center opacity-65 transition hover:text-[#D7F54A] hover:opacity-100 sm:grid" aria-label="Search"><Search size={16} strokeWidth={1.5} /></Link>
            <Link href={isAuthenticated ? "/wishlist" : "/login"} className="hidden h-10 w-10 place-items-center opacity-65 transition hover:text-[#D7F54A] hover:opacity-100 sm:grid" aria-label="Wishlist"><Heart size={16} strokeWidth={1.5} /><span className="sr-only">{wishlist.length} items saved</span></Link>
            <button onClick={onCart} className="relative grid h-10 w-10 place-items-center opacity-80 transition hover:text-[#D7F54A] hover:opacity-100" aria-label={`Open bag with ${cartCount} items`}><ShoppingBag size={16} strokeWidth={1.5} />{cartCount > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#D7F54A] px-1 font-mono text-[8px] font-bold text-[#111211]">{cartCount}</span>}</button>
            {isAuthenticated ? (
              <Link href={user?.role === "admin" ? "/admin" : "/profile"} className="grid h-10 w-10 place-items-center opacity-65 transition hover:text-[#D7F54A] hover:opacity-100" aria-label="Account"><User size={16} strokeWidth={1.5} /></Link>
            ) : (
              <Link href="/login" className="grid h-10 w-10 place-items-center opacity-65 transition hover:text-[#D7F54A] hover:opacity-100" aria-label="Sign in"><User size={16} strokeWidth={1.5} /></Link>
            )}
            <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Open menu"><Menu size={18} strokeWidth={1.5} /></button>
          </div>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 z-50 bg-[#111211] p-5 text-[#EAE8E1] lg:hidden"><div className="flex items-center justify-between"><span className="font-display text-[15px] tracking-[0.14em]">LYWΛRO</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div><nav className="mt-20 space-y-5">{nav.map((item, index) => <Link key={item} href={item === "SHOP" ? "/shop" : "/shop"} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-white/10 pb-4 font-display text-4xl tracking-tight"><span>{item}</span><span className="font-mono text-[10px] text-[#D7F54A]">0{index + 1}</span></Link>)}</nav>{!isAuthenticated && <div className="absolute bottom-20 left-5"><Link href="/login" onClick={() => setMenuOpen(false)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D7F54A]">Sign in</Link></div>}<p className="absolute bottom-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Engineered to move.</p></div>}
    </>
  );
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, cartTotal, removeFromCart, setQuantity } = useStore();
  const { isAuthenticated } = useAuth();
  return <>
    {open && <button aria-label="Close cart" onClick={onClose} className="fixed inset-0 z-40 bg-[#111211]/50 backdrop-blur-[2px]" />}
    <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[430px] flex-col bg-[#EAE8E1] text-[#111211] shadow-2xl transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-[#111211]/10 px-6 py-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#111211]/45">Your selection</p><h2 className="mt-1 font-display text-2xl tracking-tight">THE BAG <span className="font-mono text-sm text-[#111211]/40">({cart.length})</span></h2></div><button onClick={onClose} aria-label="Close cart" className="grid h-10 w-10 place-items-center border border-[#111211]/15"><X size={18} /></button></div>
      <div className="flex-1 overflow-auto px-6 py-5">{cart.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><div className="grid h-14 w-14 place-items-center border border-[#111211]/15"><ShoppingBag size={20} strokeWidth={1} /></div><p className="mt-5 font-display text-2xl">Nothing here yet.</p><p className="mt-2 max-w-[220px] text-sm text-[#111211]/55">Your next pair should feel like a considered decision.</p><Link href="/shop" onClick={onClose} className="mt-6 inline-flex items-center gap-2 border-b border-[#111211] pb-1 font-mono text-[10px] uppercase tracking-[0.18em]">Shop the collection <ArrowUpRight size={12} /></Link></div> : <div className="space-y-4">{cart.map((item) => { const p = item.product || item; const name = p.name || "LYWARO"; const price = p.price || 0; const id = p._id || p.id; return <div key={item._id} className="flex gap-4 border-b border-[#111211]/10 pb-4"><div className="grid h-24 w-24 shrink-0 place-items-center bg-[#D8D6CE]"><div className="h-9 w-16 -rotate-12 rounded-[45%] bg-[#1B1E1B] shadow-[12px_9px_0_#C5C4BB]" /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><p className="font-display text-sm font-semibold">{name}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/45">Size {item.size} · {p.color || ""}</p></div><button onClick={() => removeFromCart(item._id)} className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/45 hover:text-[#111211]">Remove</button></div><div className="mt-5 flex items-center justify-between"><div className="flex items-center border border-[#111211]/15"><button onClick={() => setQuantity(item._id, item.quantity - 1)} className="h-7 w-7">−</button><span className="w-7 text-center font-mono text-[10px]">{item.quantity}</span><button onClick={() => setQuantity(item._id, item.quantity + 1)} className="h-7 w-7">+</button></div><p className="font-mono text-xs">₹{(price * item.quantity).toLocaleString()}</p></div></div></div>; })}</div>}</div>
      <div className="border-t border-[#111211]/10 p-6"><div className="flex items-baseline justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#111211]/50">Subtotal</span><span className="font-display text-2xl">₹{cartTotal.toLocaleString()}</span></div><Link href={isAuthenticated ? "/checkout" : "/login"} onClick={onClose} className="mt-5 flex w-full items-center justify-between bg-[#111211] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]"><span>Checkout</span><ArrowUpRight size={14} /></Link><p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/40">Free shipping on orders above ₹5,000</p></div>
    </aside>
  </>;
}
