import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronDown, ChevronUp, Minus, Plus, ArrowLeft, Move } from 'lucide-react';
import { Product } from '../types';
import { getProductBySlug } from '../services/productService';
import { reviews as allReviews } from '../data/products';
import { formatPrice, getStars, formatDate } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import SneakerScene from '../components/3d/SneakerScene';
import ProductVisual from '../components/ProductVisual';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then(p => {
        if (p) {
          setProduct(p);
          setSelectedSize(p.sizes[Math.floor(p.sizes.length / 2)]);
        }
      });
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-lywaro-gray/30 border-t-white rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-lywaro-gray">Loading product...</p>
        </div>
      </div>
    );
  }

  const stars = getStars(product.rating);
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { addToast('Please select a size', 'error'); return; }
    addToCart(product, selectedSize, product.colors[selectedColor].name, quantity);
    addToast(`${product.name} added to cart`, 'success');
  };

  const accordions = [
    { key: 'description', label: 'DESCRIPTION', content: product.description },
    { key: 'materials', label: 'MATERIALS', content: product.materials?.join('. ') || 'Premium materials used throughout.' },
    { key: 'technology', label: 'TECHNOLOGY', content: product.technology?.join('. ') || 'Advanced technology for maximum performance.' },
    { key: 'fit', label: 'FIT', content: product.fit || 'True to size.' },
    { key: 'shipping', label: 'SHIPPING', content: 'Free shipping on orders above ₹5,000. Standard delivery: 5-7 business days. Express delivery: 2-3 business days.' },
    { key: 'returns', label: 'RETURNS', content: 'Free returns within 30 days of delivery. Items must be unworn and in original packaging.' },
  ];

  const ratingBreakdown = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: productReviews.filter(rev => Math.round(rev.rating) === r).length,
  }));
  const maxCount = Math.max(...ratingBreakdown.map(b => b.count), 1);

  return (
    <>
      <div className="min-h-screen pt-16 lg:pt-24 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4 md:py-6">
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs text-lywaro-gray hover:text-white transition-colors">
              <ArrowLeft size={12} /> BACK TO SHOP
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left - Gallery / 3D */}
            <div>
              {product.badge && (
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-lywaro-crimson mb-3">
                  {product.badge}
                </span>
              )}

              {/* 3D model or image display */}
              {product.modelPath && activeImage === 0 ? (
                <div className="aspect-square bg-lywaro-charcoal border border-white/5 relative">
                  <SneakerScene />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-lywaro-gray/40 pointer-events-none">
                    <Move size={10} />
                    INTERACTIVE 3D · DRAG TO ROTATE
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-lywaro-charcoal border border-white/5 relative overflow-hidden">
                  <ProductVisual
                    slug={product.slug}
                    name={product.name}
                    category={product.category}
                    accentColor={product.colors[selectedColor]?.hex || '#D50000'}
                  />
                </div>
              )}

              {/* Thumbnails - horizontal scroll on mobile */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-lywaro-charcoal border transition-colors ${
                      activeImage === i ? 'border-lywaro-crimson' : 'border-white/5 hover:border-white/20'
                    } flex items-center justify-center`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <span className="text-xs font-bold text-white/20">{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight text-white mb-2">{product.name}</h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3 md:mb-4">{formatPrice(product.price)}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5 md:mb-6">
                <div className="flex items-center">
                  {Array.from({ length: stars.full }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                  ))}
                  {stars.half && <Star size={14} className="fill-yellow-500/50 text-yellow-500" />}
                </div>
                <span className="text-sm text-lywaro-gray">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Colors */}
              <div className="mb-5 md:mb-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-lywaro-gray mb-3">
                  COLOR — {product.colors[selectedColor].name}
                </p>
                <div className="flex items-center gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                        selectedColor === i ? 'border-white scale-110' : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-5 md:mb-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-lywaro-gray mb-3">SIZE</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-11 text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 text-lywaro-gray hover:border-white/30'
                      }`}
                      aria-label={`Size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 md:mb-8">
                <p className="text-xs font-semibold tracking-[0.15em] text-lywaro-gray mb-3">QUANTITY</p>
                <div className="inline-flex items-center border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-lywaro-gray hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-lywaro-gray hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden lg:block">
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
                  >
                    <ShoppingBag size={14} />
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => {
                      toggleWishlist(product.id);
                      addToast(inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`, 'success');
                    }}
                    className={`p-4 border transition-colors ${
                      inWishlist ? 'border-lywaro-crimson text-lywaro-crimson' : 'border-white/10 text-lywaro-gray hover:text-white'
                    }`}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
                  </button>
                </div>
                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="block w-full text-center py-4 border border-white/20 text-xs font-bold tracking-[0.15em] text-lywaro-gray hover:border-white/50 hover:text-white transition-colors"
                >
                  BUY NOW
                </Link>
              </div>

              {/* Accordions */}
              <div className="mt-8 lg:mt-12 border-t border-white/5">
                {accordions.map(acc => (
                  <div key={acc.key} className="border-b border-white/5">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)}
                      className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.15em] text-white hover:text-lywaro-crimson transition-colors"
                      aria-expanded={openAccordion === acc.key}
                    >
                      {acc.label}
                      {openAccordion === acc.key ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {openAccordion === acc.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-sm text-lywaro-gray leading-relaxed">{acc.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 lg:mt-32">
            <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-white mb-6 md:mb-8">REVIEWS</h2>

            <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-16">
              {/* Rating Summary */}
              <div>
                <div className="text-center mb-6">
                  <p className="text-4xl lg:text-5xl font-black text-white">{product.rating}</p>
                  <div className="flex items-center justify-center mt-2">
                    {Array.from({ length: stars.full }).map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-lywaro-gray mt-1">{product.reviewCount} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingBreakdown.map(b => (
                    <div key={b.stars} className="flex items-center gap-2">
                      <span className="text-xs text-lywaro-gray w-3">{b.stars}</span>
                      <Star size={10} className="fill-yellow-500 text-yellow-500 flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-lywaro-charcoal overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${(b.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-lywaro-gray w-6 text-right">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {productReviews.length > 0 ? (
                  productReviews.map(review => (
                    <div key={review.id} className="p-4 md:p-6 bg-lywaro-charcoal border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-lywaro-dark rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{review.userName[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{review.userName}</p>
                            {review.isVerified && (
                              <span className="text-[10px] font-bold tracking-wider text-green-400">VERIFIED PURCHASE</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-lywaro-gray hidden sm:block">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={10} className="fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{review.title}</h4>
                      <p className="text-sm text-lywaro-gray leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-lywaro-gray">No reviews yet. Be the first to review this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom action bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-lywaro-dark/95 backdrop-blur-md border-t border-white/10 px-4 py-3 safe-bottom">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleWishlist(product.id);
              addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'success');
            }}
            className={`flex-shrink-0 p-3 border transition-colors ${
              inWishlist ? 'border-lywaro-crimson text-lywaro-crimson' : 'border-white/10 text-lywaro-gray'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3.5 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
          >
            <ShoppingBag size={14} />
            ADD TO CART — {formatPrice(product.price)}
          </button>
        </div>
      </div>
    </>
  );
}
