import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { products } from '../data/products';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const wishlistProducts = items
    .map(item => products.find(p => p.id === item.productId))
    .filter(Boolean) as Product[];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">SAVED</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-10">WISHLIST</h1>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-lywaro-gray/30 mx-auto mb-4" />
            <p className="text-lg font-bold tracking-wider text-white/30 mb-2">YOUR WISHLIST IS EMPTY</p>
            <p className="text-sm text-lywaro-gray/50 mb-8">Save your favourite items for later.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-lywaro-charcoal border border-white/5 group"
              >
                <Link to={`/product/${product.slug}`} className="block aspect-square bg-lywaro-dark flex items-center justify-center relative">
                  <span className="text-4xl font-black text-white/10 tracking-wider">{product.name}</span>
                  {product.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.15em] text-lywaro-crimson bg-lywaro-crimson/10 px-2 py-1">
                      {product.badge}
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Link to={`/product/${product.slug}`} className="text-sm font-bold tracking-wider text-white hover:text-lywaro-crimson transition-colors">
                        {product.name}
                      </Link>
                      <p className="text-xs text-lywaro-gray mt-0.5">{product.colors[0]?.name}</p>
                    </div>
                    <p className="text-sm font-bold text-white">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addToCart(product, product.sizes[Math.floor(product.sizes.length / 2)], product.colors[0].name);
                        addToast(`${product.name} added to cart`, 'success');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 text-[10px] font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-colors"
                    >
                      <ShoppingBag size={12} /> ADD TO CART
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(product.id);
                        addToast(`${product.name} removed from wishlist`, 'info');
                      }}
                      className="p-2.5 border border-white/10 text-lywaro-gray hover:text-lywaro-crimson hover:border-lywaro-crimson/50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
