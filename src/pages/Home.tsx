import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ArrowUpRight, Activity, ShieldCheck, Truck, Headphones } from 'lucide-react';
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
      {/* Hero */}
      <Hero />

      {/* Collection Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-lywaro-crimson" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">LATEST</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white">THE COLLECTION</h2>
              <p className="mt-3 text-sm text-lywaro-gray">Explore the full LYWARO range.</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-lywaro-gray hover:text-white transition-colors"
            >
              VIEW ALL <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <ProductGrid products={products.slice(0, 3)} columns={3} />
        </AnimatedSection>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-lywaro-gray hover:text-white transition-colors"
          >
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-lywaro-dark">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-lywaro-crimson" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">JUST DROPPED</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white">NEW ARRIVALS</h2>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <ProductGrid products={products.slice(0, 3)} columns={3} />
          </AnimatedSection>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white">SHOP BY CATEGORY</h2>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.name}`}
                className="group relative aspect-[4/3] bg-lywaro-charcoal border border-white/5 hover:border-lywaro-crimson/30 overflow-hidden transition-all duration-500 flex items-end p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10">
                  <p className="text-3xl mb-2">{cat.icon}</p>
                  <h3 className="text-xl font-black tracking-wider text-white group-hover:text-lywaro-crimson transition-colors">
                    {cat.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-lywaro-gray mt-1">{cat.description}</p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="absolute top-4 right-4 text-white/20 group-hover:text-lywaro-crimson transition-colors"
                />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-y border-white/5 bg-lywaro-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-white/10">
                  <Activity size={22} />
                </div>
                <h4 className="text-xs md:text-sm font-black tracking-[0.2em] text-white mb-1">ENGINEERED</h4>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-lywaro-gray">FOR MOTION</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-white/10">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="text-xs md:text-sm font-black tracking-[0.2em] text-white mb-1">PREMIUM</h4>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-lywaro-gray">QUALITY</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-white/10">
                  <Truck size={22} />
                </div>
                <h4 className="text-xs md:text-sm font-black tracking-[0.2em] text-white mb-1">FAST & SECURE</h4>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-lywaro-gray">DELIVERY</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-lywaro-crimson border border-white/10">
                  <Headphones size={22} />
                </div>
                <h4 className="text-xs md:text-sm font-black tracking-[0.2em] text-white mb-1">DEDICATED</h4>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-lywaro-gray">SUPPORT</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
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
