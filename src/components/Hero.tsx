import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SneakerScene from './3d/SneakerScene';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export default function Hero() {
  const [selectedSize, setSelectedSize] = useState<number>(40);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* ---------- responsive check ---------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ---------- mouse parallax ---------- */
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [reducedMotion, isMobile]);

  /* ---------- scroll transforms ---------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY        = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const sneakerScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.82]);
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const opacity    = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scrollIndO = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] overflow-hidden"
      aria-label="Hero — LYWARO Apex"
    >
      {/* ─── sticky viewport ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Background image with parallax ── */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            y: reducedMotion ? 0 : bgY,
            scale: 1.06,
          }}
        >
          {/* Left-side black gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/45 to-black/10 pointer-events-none" />
          {/* Bottom fade to page */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 pointer-events-none" />
          {/* Top nav area darkening */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Floating crimson glow that follows the mouse */}
          <div
            className="absolute top-1/2 right-[18%] w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(213,0,0,0.32) 0%, transparent 72%)',
              filter: 'blur(48px)',
              transform: reducedMotion
                ? 'translate(20%, -52%)'
                : `translate(${20 + mousePos.x * 4}%, ${-52 + mousePos.y * 4}%)`,
              transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
        </motion.div>

        {/* ── Ghost "APEX" watermark ── */}
        <motion.span
          style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="text-[22vw] lg:text-[17vw] font-black text-white/[0.025] tracking-[0.28em]">
            APEX
          </span>
        </motion.span>

        {/* ── 3-D Sneaker ── */}
        <motion.div
          style={{ scale: reducedMotion ? 1 : sneakerScale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="pointer-events-auto
              absolute top-[8%] right-[-4%]
              w-[95%] h-[88%]
              md:top-[2%] md:right-[-2%]
              md:w-[78%] md:h-[96%]
            "
          >
            <SneakerScene />
          </div>
        </motion.div>

        {/* ── Left Hero Content ── */}
        <motion.div
          style={{ y: reducedMotion ? 0 : contentY, opacity }}
          className="absolute inset-0 flex items-center z-10 px-6 md:px-12 lg:px-16 xl:px-24 pt-16"
        >
          <div className="max-w-lg">

            {/* Tag line */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-2.5 mb-2"
            >
              <span className="block w-5 h-px bg-lywaro-crimson" />
              <span className="text-[10.5px] font-bold tracking-[0.28em] text-lywaro-crimson uppercase">
                New Drop &mdash; 2026
              </span>
            </motion.div>

            {/* Product code */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-mono text-[11px] text-white/40 tracking-[0.22em] mb-7 uppercase"
            >
              LYWARO / 001
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[56px] sm:text-[68px] md:text-[78px] lg:text-[92px] xl:text-[108px]
                         font-black tracking-tight leading-[0.88] mb-5 uppercase"
            >
              <span className="text-white block">MOVE</span>
              <span className="text-lywaro-crimson block" style={{ textShadow: '0 0 60px rgba(213,0,0,0.4)' }}>
                DIFFERENT.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              className="text-[13px] text-white/60 leading-[1.7] mb-8 max-w-xs"
            >
              Engineered for motion.<br />
              Designed for those who refuse ordinary.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.55 }}
              className="flex items-center gap-3"
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2
                  bg-lywaro-crimson text-white
                  px-6 py-3 rounded-full
                  text-[11px] font-bold tracking-[0.16em] uppercase
                  shadow-[0_0_28px_rgba(213,0,0,0.55)]
                  hover:bg-[#b80000] hover:shadow-[0_0_40px_rgba(213,0,0,0.7)]
                  transition-all duration-300"
              >
                EXPLORE COLLECTION
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link
                to="/product/apex"
                className="inline-flex items-center gap-2
                  border border-white/22 bg-white/5 backdrop-blur-sm text-white
                  px-6 py-3 rounded-full
                  text-[11px] font-bold tracking-[0.16em] uppercase
                  hover:bg-white/12 hover:border-white/45
                  transition-all duration-300"
              >
                VIEW DETAILS
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Product Info Panel — bottom right ── */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-20 md:bottom-16 lg:bottom-20
            right-5 md:right-10 lg:right-16 z-20
            text-right max-w-[260px]"
        >
          <p className="text-[15px] md:text-[17px] font-black tracking-[0.18em] text-white mb-0.5 uppercase">
            LYWARO APEX
          </p>
          <p className="text-[22px] md:text-[26px] font-black text-white mb-1.5 tabular-nums">
            ₹8,499
          </p>
          <p className="text-[10.5px] text-white/45 tracking-[0.22em] font-semibold mb-4 uppercase">
            Black / Crimson
          </p>

          {/* Size grid */}
          <div className="mb-3.5">
            <p className="text-[9.5px] font-bold tracking-[0.3em] text-white/40 mb-2 uppercase">Size</p>
            <div className="flex flex-wrap gap-[5px] justify-end">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[10.5px] font-bold transition-all duration-200 leading-none ${
                    sz === selectedSize
                      ? 'bg-lywaro-crimson text-white w-[26px] h-[26px] rounded-[3px] flex items-center justify-center shadow-[0_0_12px_rgba(213,0,0,0.6)]'
                      : 'text-white/45 hover:text-white/90 w-[26px] h-[26px] flex items-center justify-center rounded-[3px] hover:bg-white/8'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Rotate hint */}
          <div className="flex items-center justify-end gap-2 text-white/40">
            <div className="w-[15px] h-[15px] rounded-full border border-white/30 flex items-center justify-center">
              <div className="w-[5px] h-[5px] rounded-full bg-white/60" />
            </div>
            <span className="text-[9.5px] font-bold tracking-[0.24em] uppercase">Drag to Rotate</span>
          </div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          style={{ opacity: reducedMotion ? 1 : scrollIndO }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        >
          <div className="w-[18px] h-[30px] rounded-full border-[1.5px] border-white/30 flex justify-center pt-[5px]">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[3px] h-[3px] rounded-full bg-white/60"
            />
          </div>
          <span className="text-[8.5px] font-bold tracking-[0.36em] text-white/35 uppercase">Scroll</span>
        </motion.div>

      </div>
    </section>
  );
}
