import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const shipping = getCartTotal() >= 5000 ? 0 : 499;

  return (
    <div className="min-h-screen pt-16 lg:pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">YOUR BAG</span>
        </div>
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight text-white">SHOPPING BAG</h1>
          {items.length > 0 && (
            <span className="text-xs md:text-sm text-lywaro-gray">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <ShoppingBag size={40} className="text-lywaro-gray/30 mx-auto mb-4" />
            <p className="text-base md:text-lg font-bold tracking-wider text-white/30 mb-2">YOUR BAG IS EMPTY</p>
            <p className="text-xs md:text-sm text-lywaro-gray/50 mb-8">Start shopping to add items to your bag.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-12">
            {/* Items */}
            <div className="space-y-3 md:space-y-4">
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 md:gap-4 p-3 md:p-4 bg-lywaro-charcoal border border-white/5"
                >
                  {/* Image */}
                  <Link to={`/product/${item.product.slug}`}
                    className="w-20 h-20 md:w-24 md:h-24 bg-lywaro-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-xl font-bold text-white/10">{item.product.name[0]}</span>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/product/${item.product.slug}`} className="text-sm font-bold text-white hover:text-lywaro-crimson transition-colors tracking-wider block truncate">
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-lywaro-gray mt-0.5">{item.color} / {item.size}</p>
                      </div>
                      <p className="text-sm font-bold text-white flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 md:mt-3">
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="p-2 text-lywaro-gray hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="p-2 text-lywaro-gray hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className="p-2 text-lywaro-gray hover:text-lywaro-crimson transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center justify-between pt-3 md:pt-4">
                <Link to="/shop" className="flex items-center gap-2 text-xs font-bold tracking-wider text-lywaro-gray hover:text-white transition-colors">
                  <ArrowLeft size={12} /> CONTINUE SHOPPING
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold tracking-wider text-lywaro-gray hover:text-lywaro-crimson transition-colors"
                >
                  CLEAR BAG
                </button>
              </div>
            </div>

            {/* Summary — sticky on desktop, below items on mobile */}
            <div className="bg-lywaro-charcoal border border-white/5 p-5 md:p-6 h-fit lg:sticky lg:top-24">
              <h3 className="text-xs font-bold tracking-[0.2em] text-white mb-5">ORDER SUMMARY</h3>

              <div className="space-y-2.5 pb-4 border-b border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-lywaro-gray">Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-lywaro-gray">Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-lywaro-gray/60">Free shipping on orders above ₹5,000</p>
                )}
              </div>

              <div className="flex justify-between py-4">
                <span className="text-sm font-bold tracking-wider text-white">TOTAL</span>
                <span className="text-lg font-bold text-white">{formatPrice(getCartTotal() + shipping)}</span>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3.5 md:py-4 bg-white text-black text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
              >
                CHECKOUT <ArrowRight size={12} />
              </Link>

              <p className="text-center text-[10px] text-lywaro-gray/50 mt-3">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
