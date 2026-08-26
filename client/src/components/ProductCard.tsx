// Blacktop Editorial: catalog plates show footwear as objects through the APEX viewer or art-directed material studies, never abstract placeholder tokens.
import { Heart, Plus, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useStore, type Product } from "@/contexts/StoreContext";
import ModelViewer from "@/components/ModelViewer";

const editorialImages: Record<string, string> = {
  vector: "/manus-storage/lywaro-motion-editorial_e4957ff9.jpg",
  shift: "/manus-storage/lywaro-material-editorial_290d48ca.jpg",
  core: "/manus-storage/lywaro-forms-editorial_4862e40a.jpg",
};

function ObjectStudy({ product }: { product: Product }) {
  if (product.id === "apex") return <div className="h-full w-full bg-[#111211]"><ModelViewer compact /></div>;
  return <div className="relative h-full w-full overflow-hidden bg-[#20231F]"><img src={editorialImages[product.id]} alt={`${product.name} object study`} className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-[#111211]/75 via-transparent to-transparent" /><div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">0{product.id === "vector" ? 2 : product.id === "shift" ? 3 : 4} / {product.id.toUpperCase()}</div><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><div><p className="font-display text-xl text-[#EAE8E1]">{product.name.replace("LYWARO ", "")}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-white/45">Object study</p></div><span className="grid h-8 w-8 place-items-center border border-white/25 text-[#D7F54A]"><ArrowUpRight size={13} /></span></div></div>;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const saved = wishlist.includes(product.id);
  return <article className="group relative"><Link href={`/product/${product.id}`} className="block"><div className="relative aspect-[0.92] overflow-hidden"><ObjectStudy product={product} /><button onClick={(event) => { event.preventDefault(); toggleWishlist(product.id); }} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} className={`absolute right-4 top-4 grid h-9 w-9 place-items-center border transition ${saved ? "border-[#D7F54A] bg-[#D7F54A] text-[#111211]" : "border-white/25 bg-[#111211]/50 text-[#EAE8E1] opacity-0 group-hover:opacity-100"}`}><Heart size={15} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} /></button><span className="absolute bottom-4 right-4 bg-[#D7F54A] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211] opacity-0 transition group-hover:opacity-100">Quick view <ArrowUpRight size={11} className="ml-1 inline" /></span></div></Link><div className="pt-4 transition duration-300 group-hover:-translate-y-1"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-[16px] font-semibold tracking-tight">{product.name}</h3><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#111211]/50">{product.category}</p></div><p className="font-mono text-xs">${product.price}</p></div><div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#111211]/45">{product.color}</span><span className="h-2.5 w-2.5 rounded-full border border-[#111211]/20" style={{ backgroundColor: product.accent }} /></div><button onClick={() => addToCart(product)} className="flex items-center gap-1.5 border-b border-[#111211]/25 pb-1 font-mono text-[9px] uppercase tracking-[0.14em] opacity-0 transition group-hover:opacity-100 hover:border-[#111211]">Quick add <Plus size={11} /></button></div></div></article>;
}
