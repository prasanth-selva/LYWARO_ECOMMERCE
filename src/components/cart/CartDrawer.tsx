import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer — slides from right on desktop, bottom on mobile */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed z-50 bg-lywaro-dark border-white/5 flex flex-col
              bottom-0 left-0 right-0 max-h-[85vh]
              md:top-0 md:bottom-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:border-l
            "
          >
            {/* Drag handle (mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-bold tracking-[0.2em] text-white">YOUR BAG</h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-lywaro-gray hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag size={40} className="text-lywaro-gray/30 mb-4" />
                  <p className="text-sm font-bold tracking-wider text-white/30">YOUR BAG IS EMPTY</p>
                  <p className="text-xs text-lywaro-gray/50 mt-2 mb-6">Add items to get started</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 border border-white/20 text-xs font-bold tracking-wider text-lywaro-gray hover:border-white/50 hover:text-white transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-3 p-3 bg-lywaro-charcoal border border-white/5"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-18 h-18 md:w-20 md:h-20 bg-lywaro-dark flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-lg font-bold text-white/10">{item.product.name[0]}</span>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-bold text-white tracking-wider hover:text-lywaro-crimson transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-[11px] text-lywaro-gray mt-0.5">{item.color} / {item.size}</p>
                        </div>
                        <p className="text-sm font-bold text-white flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="p-1.5 text-lywaro-gray hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="p-1.5 text-lywaro-gray hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="p-1.5 text-lywaro-gray hover:text-lywaro-crimson transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-5 py-4 space-y-3 safe-bottom">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-lywaro-gray">Subtotal</span>
                  <span className="text-sm font-bold text-white">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-lywaro-gray">Shipping</span>
                  <span className="text-sm text-lywaro-gray">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-sm font-bold tracking-wider text-white">TOTAL</span>
                  <span className="text-lg font-bold text-white">{formatPrice(getCartTotal())}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-3 border border-white/20 text-[11px] font-bold tracking-wider text-lywaro-gray hover:border-white/50 hover:text-white transition-colors"
                >
                  VIEW CART
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black text-[11px] font-bold tracking-wider hover:bg-lywaro-crimson hover:text-white transition-colors"
                >
                  CHECKOUT <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
