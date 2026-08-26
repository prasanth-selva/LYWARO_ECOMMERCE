import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Rocket, ShieldCheck, Truck, Headphones } from 'lucide-react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { products, categories } from '../data/products';
import { formatPrice } from '../utils/format';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Collection Section matching Image 1 */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-white uppercase">THE COLLECTION</h2>
              <p className="mt-1 text-xs text-white/50">Explore the full LYWARO range.</p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-white/70 hover:text-white transition-colors"
            >
              VIEW ALL <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        {/* 3 Product Grid matching Image 1: APEX, VANTA, PULSE */}
        <AnimatedSection>
          <ProductGrid products={products.slice(0, 3)} columns={3} />
        </AnimatedSection>

        {/* 4 Feature Columns directly under Collection (matching Image 1) */}
        <AnimatedSection className="mt-20 pt-12 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-lywaro-crimson/20 group-hover:border-lywaro-crimson group-hover:scale-110 transition-all duration-300">
                <Rocket size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-black tracking-[0.2em] text-white mb-1.5 uppercase">ENGINEERED FOR MOTION</h4>
              <p className="text-[11px] text-white/40 max-w-[200px] leading-relaxed">Performance built without compromise.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-lywaro-crimson/20 group-hover:border-lywaro-crimson group-hover:scale-110 transition-all duration-300">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-black tracking-[0.2em] text-white mb-1.5 uppercase">PREMIUM QUALITY</h4>
              <p className="text-[11px] text-white/40 max-w-[200px] leading-relaxed">Finest materials. Superior craftsmanship.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-lywaro-crimson/20 group-hover:border-lywaro-crimson group-hover:scale-110 transition-all duration-300">
                <Truck size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-black tracking-[0.2em] text-white mb-1.5 uppercase">FAST & SECURE DELIVERY</h4>
              <p className="text-[11px] text-white/40 max-w-[200px] leading-relaxed">Delivering speed. Delivering trust.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-lywaro-crimson/20 group-hover:border-lywaro-crimson group-hover:scale-110 transition-all duration-300">
                <Headphones size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-black tracking-[0.2em] text-white mb-1.5 uppercase">DEDICATED SUPPORT</h4>
              <p className="text-[11px] text-white/40 max-w-[200px] leading-relaxed">We're here for you. Always.</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Brand Story */}
      <section className="py-12 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-lywaro-charcoal">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-lywaro-crimson" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">OUR STORY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-6">
                  WE DON'T FOLLOW MOTION.<br />
                  <span className="text-lywaro-crimson">WE CREATE IT.</span>
                </h2>
                <p className="text-sm text-lywaro-gray leading-relaxed mb-8">
                  Born from the intersection of technology and streetwear culture, LYWARO is engineered
                  for those who refuse to move with the crowd. Every product is a statement. Every step
                  is intentional.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
                >
                  READ OUR STORY
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="aspect-[4/3] bg-lywaro-dark border border-white/5 flex items-center justify-center">
                <span className="text-6xl font-black text-white/5 tracking-wider">LYWARO</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="relative bg-gradient-to-r from-lywaro-charcoal to-lywaro-dark border border-white/5 p-6 md:p-8 lg:p-16 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-lywaro-crimson to-transparent" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-4">FREE SHIPPING</p>
            <h3 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-white mb-4">
              ON ALL ORDERS ABOVE ₹5,000
            </h3>
            <p className="text-sm text-lywaro-gray mb-8">No minimum. Free express delivery across India.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
            >
              SHOP NOW
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Newsletter */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-lywaro-dark">
        <div className="max-w-xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-4">STAY CONNECTED</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">JOIN THE MOVEMENT</h2>
            <p className="text-sm text-lywaro-gray mb-8">
              Be the first to know about new drops, exclusive offers, and LYWARO stories.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Subscribed! (mock)');
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300 flex-shrink-0 w-full sm:w-auto"
              >
                SUBSCRIBE
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
