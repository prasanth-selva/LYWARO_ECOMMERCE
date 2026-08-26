import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import QuickView from './QuickView';
import ProductVisual from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[Math.floor(product.sizes.length / 2)], product.colors[0].name);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast(wishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`, 'success');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  return (
    <>
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Card image area ── */}
        <div
          className="relative aspect-square bg-[#111111] overflow-hidden
            border border-white/[0.07]
            group-hover:border-lywaro-crimson/40
            group-hover:shadow-[0_0_36px_rgba(213,0,0,0.14)]
            transition-all duration-500"
        >
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10 bg-lywaro-crimson text-white
              text-[9px] font-black tracking-[0.18em] px-2.5 py-1 uppercase">
              {product.badge}
            </div>
          )}

          {/* Shoe visual */}
          <ProductVisual
            slug={product.slug}
            name={product.name}
            category={product.category}
            accentColor={product.colors[0]?.hex || '#D50000'}
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Hover overlay — subtle darkening */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-black/30"
              />
            )}
          </AnimatePresence>

          {/* Quick-view button — appears on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22 }}
                onClick={handleQuickView}
                className="absolute bottom-14 left-1/2 -translate-x-1/2
                  flex items-center gap-1.5 z-20
                  bg-white/10 backdrop-blur-sm border border-white/20 text-white
                  px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase
                  hover:bg-white/20 transition-colors duration-200 whitespace-nowrap"
              >
                <Eye size={12} /> Quick View
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Wishlist icon — top right ── */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 p-1.5 transition-transform duration-200 hover:scale-110"
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              size={17}
              strokeWidth={wishlisted ? 0 : 1.6}
              className={wishlisted ? 'fill-lywaro-crimson text-lywaro-crimson' : 'text-white/55 hover:text-white'}
            />
          </button>

          {/* ── Red + button — bottom right (matches reference exactly) ── */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 z-10
              w-8 h-8 bg-lywaro-crimson text-white
              flex items-center justify-center
              text-lg font-black leading-none
              hover:bg-[#b80000]
              shadow-[0_0_14px_rgba(213,0,0,0.5)]
              hover:shadow-[0_0_22px_rgba(213,0,0,0.7)]
              transition-all duration-200 active:scale-90"
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>

        {/* ── Card info row ── */}
        <div className="mt-3.5 space-y-0.5 px-0.5">
          <h3 className="text-[13px] font-black tracking-[0.14em] text-white uppercase
            group-hover:text-lywaro-crimson transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-[13px] font-bold text-white">
            {formatPrice(product.price)}
          </p>
          <p className="text-[11px] text-white/40 tracking-wider">
            {product.colors[0]?.name}
          </p>
        </div>
      </Link>

      {quickView && (
        <QuickView product={product} onClose={() => setQuickView(false)} />
      )}
    </>
  );
}
