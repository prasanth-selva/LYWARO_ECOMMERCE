import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getStars } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductVisual from './ProductVisual';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const stars = getStars(product.rating);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    addToast(`${product.name} added to cart`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-lywaro-charcoal border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-lywaro-gray hover:text-white transition-colors"
            aria-label="Close quick view"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="aspect-square bg-lywaro-dark relative overflow-hidden">
              <ProductVisual
                slug={product.slug}
                name={product.name}
                category={product.category}
                accentColor={product.colors[0]?.hex || '#D50000'}
              />
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col">
              {product.badge && (
                <span className="text-[10px] font-bold tracking-[0.2em] text-lywaro-crimson mb-2">
                  {product.badge}
                </span>
              )}
              <h3 className="text-xl font-black tracking-wider text-white">{product.name}</h3>
              <p className="text-lg font-bold text-white mt-1">{formatPrice(product.price)}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {Array.from({ length: stars.full }).map((_, i) => (
                    <Star key={`full-${i}`} size={12} className="fill-yellow-500 text-yellow-500" />
                  ))}
                  {stars.half && <Star size={12} className="fill-yellow-500/50 text-yellow-500" />}
                </div>
                <span className="text-xs text-lywaro-gray">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Colors */}
              <div className="mt-4">
                <p className="text-xs font-semibold tracking-wider text-lywaro-gray mb-2">{selectedColor}</p>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        selectedColor === color.name ? 'border-white' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-4">
                <p className="text-xs font-semibold tracking-wider text-lywaro-gray mb-2">SIZE</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-10 text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 text-lywaro-gray hover:border-white/50'
                      }`}
                      aria-label={`Size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6 space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 text-xs font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-colors"
                >
                  <ShoppingBag size={14} />
                  ADD TO CART
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toggleWishlist(product.id);
                      addToast(
                        inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
                        'success'
                      );
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 border py-3 text-xs font-bold tracking-wider transition-colors ${
                      inWishlist
                        ? 'border-lywaro-crimson text-lywaro-crimson'
                        : 'border-white/20 text-lywaro-gray hover:border-white/50 hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
                    {inWishlist ? 'WISHLISTED' : 'WISHLIST'}
                  </button>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/20 py-3 text-xs font-bold tracking-wider text-lywaro-gray hover:border-white/50 hover:text-white transition-colors"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
