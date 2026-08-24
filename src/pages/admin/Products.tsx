import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, X, Eye } from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', slug: '', price: '', description: '', category: 'Running', gender: 'Unisex',
    stock: '', badge: '',
  });
  const { addToast } = useToast();

  const filtered = productsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', slug: '', price: '', description: '', category: 'Running', gender: 'Unisex', stock: '', badge: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, slug: p.slug, price: p.price.toString(), description: p.description,
      category: p.category, gender: p.gender, stock: p.stock.toString(), badge: p.badge || '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProductsList(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p, name: form.name, slug: form.slug, price: Number(form.price),
        description: form.description, category: form.category, gender: form.gender,
        stock: Number(form.stock), badge: form.badge || undefined,
      } : p));
      addToast('Product updated', 'success');
    } else {
      const newProduct: Product = {
        id: `lywaro-${Date.now()}`, name: form.name, slug: form.slug || form.name.toLowerCase(),
        price: Number(form.price), description: form.description, category: form.category,
        gender: form.gender, colors: [{ name: 'Black', hex: '#050505' }], sizes: [38, 39, 40, 41, 42, 43],
        images: [], rating: 0, reviewCount: 0, stock: Number(form.stock), badge: form.badge || undefined,
      };
      setProductsList(prev => [newProduct, ...prev]);
      addToast('Product created', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
    addToast('Product deleted', 'info');
  };

  const inputClass = "w-full bg-lywaro-dark border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">PRODUCTS</h1>
          <p className="text-sm text-lywaro-gray mt-1">{productsList.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-all"
        >
          <Plus size={14} /> ADD PRODUCT
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lywaro-gray" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-lywaro-charcoal border border-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-lywaro-charcoal border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">PRODUCT</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden md:table-cell">CATEGORY</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden lg:table-cell">GENDER</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">PRICE</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden sm:table-cell">STOCK</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-lywaro-dark flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white/20">{product.name[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{product.name}</p>
                        {product.badge && (
                          <span className="text-[9px] font-bold tracking-wider text-lywaro-crimson">{product.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-lywaro-gray hidden md:table-cell">{product.category}</td>
                  <td className="py-3 px-4 text-xs text-lywaro-gray hidden lg:table-cell">{product.gender}</td>
                  <td className="py-3 px-4 text-xs font-bold text-white text-right">{formatPrice(product.price)}</td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className={`text-[10px] font-bold ${product.stock > 20 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-lywaro-crimson'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-lywaro-gray hover:text-white transition-colors" aria-label="Edit product">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-lywaro-gray hover:text-lywaro-crimson transition-colors" aria-label="Delete product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-white/30">NO PRODUCTS FOUND</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-lywaro-charcoal border border-white/10 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="text-sm font-bold tracking-[0.2em] text-white">
                  {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 text-lywaro-gray hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">NAME</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">SLUG</label>
                    <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">PRICE (₹)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">STOCK</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">CATEGORY</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass}>
                      <option value="Running">Running</option>
                      <option value="Training">Training</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">GENDER</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className={inputClass}>
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">BADGE (optional)</label>
                  <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. NEW DROP, LIMITED" className={inputClass} />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">DESCRIPTION</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/5">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-xs font-bold tracking-wider text-lywaro-gray hover:text-white transition-colors">
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name || !form.price}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-all disabled:opacity-30"
                >
                  {editingProduct ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
