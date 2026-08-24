import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const orderNumber = `LYW-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 bg-lywaro-crimson/10 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={40} className="text-lywaro-crimson" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-4">ORDER CONFIRMED</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
            ORDER #{orderNumber}
          </h1>
          <p className="text-sm text-lywaro-gray mb-8">
            Your LYWARO journey starts now. We'll send you updates via email.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/track-order/${orderNumber}`}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
            >
              <Package size={14} />
              TRACK ORDER
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 border border-white/20 text-white px-8 py-4 text-xs font-bold tracking-[0.15em] hover:border-white/50 transition-colors"
            >
              CONTINUE SHOPPING
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
