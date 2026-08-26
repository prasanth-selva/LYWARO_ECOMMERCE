import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const inWishlist = isInWishlist(product.id);

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
    addToast(
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
      'success'
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square bg-lywaro-charcoal overflow-hidden border border-white/5 group-hover:border-lywaro-crimson/50 group-hover:shadow-[0_0_30px_rgba(213,0,0,0.15)] transition-all duration-500">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10 bg-lywaro-crimson text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1">
              {product.badge}
            </div>
          )}

          {/* Styled Metallic Sneaker Visual */}
          <ProductVisual
            slug={product.slug}
            name={product.name}
            category={product.category}
            accentColor={product.colors[0]?.hex || '#D50000'}
          />

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 flex items-end justify-center p-4"
          >
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 text-xs font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag size={14} />
                QUICK ADD
              </button>
              <button
                onClick={handleQuickView}
                className="p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label={`Quick view ${product.name}`}
              >
                <Eye size={14} />
              </button>
            </div>
          </motion.div>

          {/* Red Plus Button in Bottom Right Corner matching Image 1 */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-lywaro-crimson text-white flex items-center justify-center font-bold text-lg hover:bg-[#b00000] shadow-[0_0_15px_rgba(213,0,0,0.5)] transition-transform duration-200 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
          >
            +
          </button>

          {/* Wishlist Icon in Top Right */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 p-2 transition-all duration-300"
            aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={`transition-colors duration-300 ${
                inWishlist ? 'fill-lywaro-crimson text-lywaro-crimson' : 'text-white/60 hover:text-white'
              }`}
            />
          </button>
        </div>

        {/* Info matching Image 1 layout */}
        <div className="mt-3.5 space-y-0.5">
          <h3 className="text-base font-black tracking-widest text-white group-hover:text-lywaro-crimson transition-colors uppercase">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-white">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-white/50 tracking-wider">
            {product.colors[0]?.name}
          </p>
        </div>
      </Link>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickView
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
