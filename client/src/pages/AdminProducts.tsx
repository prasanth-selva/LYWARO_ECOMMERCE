import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Image, Plus, Pencil, Trash2, Upload, Search, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import productService from "@/services/productService";
import { toast } from "sonner";

const emptyProduct = {
  name: "", slug: "", description: "", shortDescription: "", price: 0,
  compareAtPrice: 0, category: "sneakers", gender: "unisex", brand: "LYWARO",
  colors: [""], sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  images: [] as string[], stock: 0, featured: false, bestseller: false, newArrival: false,
  specifications: [], tags: [] as string[],
};

const defaultImages: Record<string, string> = {
  apex: "/products/apex.svg",
  vector: "/products/vector.svg",
  shift: "/products/shift.svg",
  core: "/products/core.svg",
  surge: "/products/surge.svg",
  drift: "/products/drift.svg",
};

function getProductImage(product: any): string {
  if (product.images?.length > 0) return product.images[0];
  const key = product.slug?.replace("lywaro-", "") || "";
  return defaultImages[key] || "";
}

export default function AdminProducts() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageUrl, setImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) navigate("/login");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => { loadProducts(); }, [isAdmin]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProducts({ limit: 50 });
      setProducts(res.data?.products || []);
    } catch { toast.error("Failed to load products"); }
    finally { setLoadingProducts(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageUrl("");
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name, slug: product.slug, description: product.description || "",
      shortDescription: product.shortDescription || "", price: product.price,
      compareAtPrice: product.compareAtPrice || 0, category: product.category,
      gender: product.gender, brand: product.brand || "LYWARO",
      colors: product.colors?.length ? product.colors : [""],
      sizes: product.sizes || [], images: product.images || [],
      stock: product.stock, featured: product.featured,
      bestseller: product.bestseller, newArrival: product.newArrival,
      specifications: product.specifications || [], tags: product.tags || [],
    });
    setImageUrl(product.images?.[0] || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (form.price <= 0) { toast.error("Price must be greater than 0"); return; }
    if (form.stock < 0) { toast.error("Stock cannot be negative"); return; }

    const data = { ...form };
    data.images = imageUrl ? [imageUrl] : [];
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    try {
      if (editing) {
        await productService.updateProduct(editing._id, data);
        toast.success("Product updated successfully");
      } else {
        await productService.createProduct(data);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (err: any) { toast.error(err.message || "Failed to delete"); }
  };

  const filtered = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
                <ArrowLeft size={13} /> Dashboard
              </Link>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.06em]">Products</h1>
              <p className="mt-2 text-sm text-[#111211]/50">{products.length} products in catalog</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111211]/30" />
                <input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-[#111211]/15 bg-transparent pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#111211] w-48 sm:w-56 transition"
                />
              </div>
              <button onClick={openCreate} className="flex items-center gap-2 bg-[#111211] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]">
                <Plus size={13} /> Add product
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#111211]/[0.04] border border-[#111211]/10" />
                  <div className="border border-t-0 border-[#111211]/10 p-4 space-y-3">
                    <div className="h-4 bg-[#111211]/[0.04] w-2/3" />
                    <div className="h-3 bg-[#111211]/[0.04] w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => {
                const img = getProductImage(product);
                return (
                  <div key={product._id} className="group border border-[#111211]/15 transition hover:border-[#111211]/30 hover:shadow-sm">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#181B18]">
                      {img ? (
                        <img src={img} alt={product.name} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="text-center">
                            <Image size={32} className="mx-auto text-white/15" />
                            <p className="mt-2 font-mono text-[9px] text-white/20 uppercase tracking-wider">No image</p>
                          </div>
                        </div>
                      )}
                      {/* Badges overlay */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {product.featured && <span className="px-2.5 py-1 bg-[#D7F54A] font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-[#111211]">Featured</span>}
                        {product.bestseller && <span className="px-2.5 py-1 bg-blue-500 font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-white">Bestseller</span>}
                        {product.newArrival && <span className="px-2.5 py-1 bg-purple-500 font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-white">New</span>}
                      </div>
                      {/* Stock badge */}
                      <div className="absolute right-3 top-3">
                        <span className={`px-2.5 py-1 font-mono text-[8px] font-medium uppercase tracking-[0.1em] ${product.stock > 20 ? "bg-green-500/90 text-white" : product.stock > 0 ? "bg-yellow-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
                          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/45">{product.category} · {product.gender}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                          {product.compareAtPrice > 0 && (
                            <p className="font-mono text-[9px] text-[#111211]/30 line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-[#111211]/50 leading-relaxed">{product.description}</p>
                      )}
                      {/* Color chips */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {product.colors?.filter(Boolean).map((c: string, i: number) => (
                          <span key={i} className="font-mono text-[8px] uppercase border border-[#111211]/15 px-2 py-0.5 text-[#111211]/50">{c}</span>
                        ))}
                      </div>
                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-2 border-t border-[#111211]/10 pt-3">
                        <button onClick={() => openEdit(product)} className="flex items-center gap-1.5 border border-[#111211]/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition hover:bg-[#111211] hover:text-[#EAE8E1]">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1.5 border border-red-200 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-red-500 transition hover:bg-red-50">
                          <Trash2 size={11} /> Delete
                        </button>
                        <span className="ml-auto font-mono text-[8px] text-[#111211]/25">ID: {product._id.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loadingProducts && filtered.length === 0 && products.length > 0 && (
            <div className="mt-16 text-center">
              <Search size={28} className="mx-auto text-[#111211]/15 mb-3" />
              <p className="text-sm text-[#111211]/40">No products match "{searchQuery}"</p>
              <button onClick={() => setSearchQuery("")} className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/60 hover:text-[#111211]">Clear search</button>
            </div>
          )}

          {!loadingProducts && products.length === 0 && (
            <div className="mt-16 border border-dashed border-[#111211]/20 py-24 text-center">
              <Package size={36} className="mx-auto text-[#111211]/15 mb-4" />
              <p className="font-display text-xl">No products yet</p>
              <p className="mt-2 text-sm text-[#111211]/40">Start by adding your first product to the catalog</p>
              <button onClick={openCreate} className="mt-6 inline-flex items-center gap-2 bg-[#111211] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]">
                <Plus size={13} /> Add first product
              </button>
            </div>
          )}

          {/* ========== PRODUCT MODAL ========== */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#111211]/60 p-4 pt-12 sm:pt-20">
              <div className="w-full max-w-3xl bg-[#EAE8E1] border border-[#111211]/15 shadow-2xl">
                {/* Modal header */}
                <div className="flex items-center justify-between border-b border-[#111211]/10 px-6 py-4">
                  <h2 className="font-display text-xl">{editing ? "Edit Product" : "New Product"}</h2>
                  <button onClick={() => setShowModal(false)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/40 hover:text-[#111211] transition">
                    Close ✕
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-6">
                  {/* IMAGE SECTION */}
                  <div className="border border-[#111211]/15 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload size={14} className="text-[#111211]/50" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/60 font-medium">Product Image</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                      <div>
                        <input
                          placeholder="Image URL (e.g. /products/apex.svg)"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                        />
                        <p className="mt-2 text-[10px] text-[#111211]/35">Paste a URL or select a preset below</p>
                        {/* Quick pick buttons */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {["apex", "vector", "shift", "core", "surge", "drift"].map((name) => (
                            <button
                              key={name}
                              onClick={() => setImageUrl(`/products/${name}.svg`)}
                              className={`border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] transition ${
                                imageUrl === `/products/${name}.svg`
                                  ? "border-[#111211] bg-[#111211] text-[#EAE8E1]"
                                  : "border-[#111211]/15 hover:border-[#111211] hover:bg-[#111211]/[0.03]"
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Live preview */}
                      <div className="aspect-square border border-[#111211]/10 bg-[#181B18] flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-full w-full object-contain p-3"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = "none";
                              img.parentElement!.innerHTML = '<div class="text-center p-2"><p class="text-[10px] text-red-400/70">Failed to load</p></div>';
                            }}
                          />
                        ) : (
                          <div className="text-center p-3">
                            <Image size={24} className="mx-auto text-white/15 mb-2" />
                            <p className="font-mono text-[9px] text-white/25 uppercase tracking-wider">No image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NAME + SLUG */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Product Name *</label>
                      <input
                        placeholder="LYWARO APEX"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Slug</label>
                      <input
                        placeholder="lywaro-apex (auto-generated)"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Description</label>
                    <textarea
                      placeholder="Product description..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] resize-none transition"
                    />
                  </div>

                  {/* PRICE + COMPARE AT + STOCK */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="4999"
                        value={form.price || ""}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Compare At (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.compareAtPrice || ""}
                        onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Stock *</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={form.stock || ""}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                      />
                    </div>
                  </div>

                  {/* CATEGORY + GENDER */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none transition"
                      >
                        <option value="sneakers">Sneakers</option>
                        <option value="running">Running</option>
                        <option value="training">Training</option>
                        <option value="lifestyle">Lifestyle</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none transition"
                      >
                        <option value="unisex">Unisex</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                      </select>
                    </div>
                  </div>

                  {/* COLORS */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium">Colors (comma separated)</label>
                    <input
                      placeholder="Carbon, Citron, Midnight"
                      value={form.colors?.join(", ") || ""}
                      onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] transition"
                    />
                  </div>

                  {/* BADGES */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 font-medium mb-3 block">Product Badges</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { key: "featured", label: "Featured" },
                        { key: "bestseller", label: "Bestseller" },
                        { key: "newArrival", label: "New Arrival" },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={(form as any)[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                            className="w-4 h-4 accent-[#D7F54A]"
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#111211]/60 group-hover:text-[#111211] transition">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex gap-3 border-t border-[#111211]/10 px-6 py-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#111211] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]"
                  >
                    {editing ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="border border-[#111211]/20 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] transition hover:border-[#111211]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
