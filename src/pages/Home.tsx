import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Rocket, ShieldCheck, Truck, Headphones } from 'lucide-react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { products, categories } from '../data/products';

/* ── Fade-up on scroll ── */
function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: Rocket,      title: 'Engineered',  sub: 'For Motion',    desc: 'Performance built without compromise.' },
  { icon: ShieldCheck, title: 'Premium',     sub: 'Quality',       desc: 'Finest materials. Superior craftsmanship.' },
  { icon: Truck,       title: 'Fast & Secure', sub: 'Delivery',    desc: 'Delivering speed. Delivering trust.' },
  { icon: Headphones,  title: 'Dedicated',   sub: 'Support',       desc: "We're here for you. Always." },
];

export default function Home() {
  return (
    <div className="bg-[#050505]">

      {/* ───────── HERO ───────── */}
      <Hero />

      {/* ───────── THE COLLECTION ───────── */}
      <section className="pt-20 pb-8 lg:pt-28 lg:pb-12 px-5 sm:px-8 lg:px-14 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-8 lg:mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-2 uppercase">
                Latest
              </p>
              <h2 className="text-[28px] lg:text-[40px] font-black tracking-tight text-white uppercase leading-none">
                The Collection
              </h2>
              <p className="mt-2 text-[12px] text-white/40">Explore the full LYWARO range.</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors uppercase"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ProductGrid products={products.slice(0, 3)} columns={3} />
        </Reveal>

        {/* Mobile "view all" */}
        <div className="mt-7 text-center sm:hidden">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors uppercase">
            View All <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ───────── FEATURES STRIP ───────── */}
      <section className="py-14 lg:py-20 border-t border-white/[0.05] px-5 sm:px-8 lg:px-14 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-6 text-center">
            {FEATURES.map(({ icon: Icon, title, sub, desc }) => (
              <div key={title} className="flex flex-col items-center group">
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-4
                    border border-lywaro-crimson/25 bg-lywaro-crimson/5 text-lywaro-crimson
                    group-hover:border-lywaro-crimson group-hover:bg-lywaro-crimson/12
                    group-hover:scale-110 transition-all duration-300"
                >
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <p className="text-[11px] font-black tracking-[0.2em] text-white uppercase mb-0.5">{title}</p>
                <p className="text-[11px] font-black tracking-[0.2em] text-lywaro-crimson uppercase mb-2">{sub}</p>
                <p className="text-[11px] text-white/35 max-w-[160px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────── NEW ARRIVALS ───────── */}
      <section className="py-14 lg:py-24 px-5 sm:px-8 lg:px-14 bg-[#0B0B0B]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-8 lg:mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-2 uppercase">Just Dropped</p>
                <h2 className="text-[28px] lg:text-[40px] font-black tracking-tight text-white uppercase leading-none">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors uppercase"
              >
                Shop All <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ProductGrid products={products.slice(3, 6)} columns={3} />
          </Reveal>
        </div>
      </section>

      {/* ───────── SHOP BY CATEGORY ───────── */}
      <section className="py-14 lg:py-24 px-5 sm:px-8 lg:px-14 max-w-[1400px] mx-auto">
        <Reveal>
          <h2 className="text-[28px] lg:text-[40px] font-black tracking-tight text-white uppercase text-center mb-10">
            Shop by Category
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.name}`}
                className="group relative aspect-[4/3] bg-[#111111] border border-white/[0.06]
                  hover:border-lywaro-crimson/35 overflow-hidden transition-all duration-500
                  flex items-end p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(213,0,0,0.12), transparent)' }}
                />
                <div className="relative z-10">
                  <p className="text-2xl mb-2">{cat.icon}</p>
                  <h3 className="text-[18px] font-black tracking-[0.12em] text-white group-hover:text-lywaro-crimson transition-colors">
                    {cat.name.toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-white/40 mt-1">{cat.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="absolute top-4 right-4 text-white/20 group-hover:text-lywaro-crimson transition-colors"
                />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────── BRAND STORY ───────── */}
      <section className="py-14 lg:py-24 px-5 sm:px-8 lg:px-14 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-4 uppercase">Our Story</p>
                <h2 className="text-[28px] lg:text-[44px] font-black tracking-tight text-white leading-tight mb-6">
                  WE DON'T FOLLOW MOTION.<br />
                  <span className="text-lywaro-crimson">WE CREATE IT.</span>
                </h2>
                <p className="text-[13px] text-white/50 leading-[1.75] mb-8 max-w-md">
                  Born from the intersection of technology and streetwear culture, LYWARO is engineered
                  for those who refuse to move with the crowd. Every product is a statement. Every step
                  is intentional.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white text-black
                    px-7 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase
                    hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
                >
                  READ OUR STORY <ArrowRight size={13} />
                </Link>
              </div>

              {/* Story visual — crimson glow box */}
              <div className="aspect-[4/3] bg-[#0a0a0a] border border-white/[0.05] flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(213,0,0,0.1) 0%, transparent 70%)' }}
                />
                <span className="relative text-[52px] lg:text-[72px] font-black text-white/[0.04] tracking-[0.2em]">
                  LYWARO
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── PROMO BANNER ───────── */}
      <section className="py-14 lg:py-24 px-5 sm:px-8 lg:px-14 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="relative bg-gradient-to-r from-[#111111] to-[#0d0d0d] border border-white/[0.06] p-8 lg:p-16 text-center overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-px bg-gradient-to-r from-transparent via-lywaro-crimson to-transparent" />
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 40% 60% at 50% 0%, rgba(213,0,0,0.07), transparent)' }}
            />
            <p className="text-[10px] font-bold tracking-[0.35em] text-lywaro-crimson mb-3 uppercase">Free Shipping</p>
            <h3 className="text-[22px] lg:text-[38px] font-black tracking-tight text-white mb-3 uppercase">
              On All Orders Above ₹5,000
            </h3>
            <p className="text-[13px] text-white/45 mb-8">No minimum. Free express delivery across India.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black
                px-8 py-4 text-[11px] font-black tracking-[0.18em] uppercase
                hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
            >
              SHOP NOW <ArrowRight size={13} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ───────── NEWSLETTER ───────── */}
      <section className="py-14 lg:py-24 px-5 bg-[#0B0B0B]">
        <div className="max-w-lg mx-auto text-center">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.35em] text-lywaro-crimson mb-3 uppercase">Stay Connected</p>
            <h2 className="text-[26px] lg:text-[36px] font-black tracking-tight text-white mb-3 uppercase">
              Join the Movement
            </h2>
            <p className="text-[13px] text-white/45 mb-8">
              Be the first to know about new drops, exclusive offers, and LYWARO stories.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 bg-[#111111] border border-white/10 px-4 py-3.5 text-[13px] text-white
                  placeholder:text-white/30 focus:outline-none focus:border-lywaro-crimson/60 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-black px-7 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase
                  hover:bg-lywaro-crimson hover:text-white transition-all duration-300 flex-shrink-0 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
