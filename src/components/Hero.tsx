import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, RotateCcw, Move, Maximize2 } from 'lucide-react';
import SneakerScene from './3d/SneakerScene';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { formatPrice } from '../utils/format';

export default function Hero() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState<number>(40);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const apexY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const sneakerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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

  const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] bg-lywaro-black overflow-hidden"
      aria-label="Hero section"
    >
      {/* Sticky hero container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Volcanic hero background image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            y: reducedMotion ? 0 : bgY,
          }}
        >
          {/* Subtle dark gradient overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent md:from-black/75 md:via-black/20 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-lywaro-black via-transparent to-black/40 pointer-events-none" />

          {/* Red crimson glow accent */}
          <div
            className="absolute top-1/2 right-[20%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.18] pointer-events-none blur-3xl"
            style={{
              background: 'radial-gradient(circle, #D50000 0%, transparent 75%)',
              transform: reducedMotion
                ? 'translate(20%, -50%)'
                : `translate(${20 + mousePos.x * 3}%, ${-50 + mousePos.y * 3}%)`,
              transition: 'transform 0.8s ease-out',
            }}
          />
        </motion.div>

        {/* APEX watermark background text */}
        <motion.div
          style={{ y: reducedMotion ? 0 : apexY, opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="text-[25vw] md:text-[20vw] lg:text-[16vw] font-black text-white/[0.03] tracking-[0.25em]"
            aria-hidden="true"
          >
            APEX
          </span>
        </motion.div>

        {/* 3D Sneaker */}
        <motion.div
          style={{
            scale: reducedMotion ? 1 : sneakerScale,
            y: reducedMotion ? 0 : contentY,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className={`
              w-full h-full
              md:absolute md:right-[2%] md:top-[0%]
              md:w-[75%] md:h-[85%] md:max-w-4xl
              absolute right-0 top-[12%]
              w-[90%] h-[55%] max-w-xl
            `}
          >
            <SneakerScene onInteractionStart={() => setHasInteracted(true)} />
          </div>
        </motion.div>

        {/* Hero Content — Left side */}
        <motion.div
          style={{ y: reducedMotion ? 0 : contentY, opacity }}
          className="absolute inset-0 flex flex-col justify-center z-10
            px-6 md:px-12 lg:px-20 xl:px-24 pt-16 md:pt-0
          "
        >
          <div className="max-w-xl">
            {/* Top tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-6 h-px bg-lywaro-crimson" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-lywaro-crimson">
                NEW DROP - 2026
              </span>
            </motion.div>

            {/* Product code */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs font-mono text-white/50 tracking-widest mb-6"
            >
              LYWARO / 001
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] mb-6"
            >
              <span className="text-white">MOVE</span>
              <br />
              <span className="text-lywaro-crimson">DIFFERENT.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xs md:text-sm text-white/70 max-w-md leading-relaxed mb-8 font-normal"
            >
              Engineered for motion.<br />
              Designed for those who refuse ordinary.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-row items-center gap-3 sm:gap-4"
            >
              <Link
                to="/shop"
                className="group flex items-center justify-center gap-2 bg-lywaro-crimson text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] hover:bg-[#b00000] shadow-[0_0_25px_rgba(213,0,0,0.4)] transition-all duration-300"
              >
                EXPLORE COLLECTION
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/product/apex"
                className="flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm border border-white/25 text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] hover:border-white/60 hover:bg-black/60 transition-all duration-300"
              >
                VIEW DETAILS
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Product details overlay — Right side overlay (matches Image 1) */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-24 md:bottom-24 lg:bottom-28 z-20
            right-6 md:right-12 lg:right-20 text-left md:text-right max-w-xs
          "
        >
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-white mb-0.5">
            LYWARO APEX
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">
            ₹8,499
          </p>
          <p className="text-[10px] sm:text-[11px] text-white/50 tracking-[0.2em] font-semibold mb-4 uppercase">
            BLACK / CRIMSON
          </p>

          {/* Size Selector Grid matching reference image */}
          <div className="mb-4">
            <p className="text-[10px] font-bold tracking-[0.25em] text-white/60 mb-2 uppercase">
              SIZE
            </p>
            <div className="flex flex-wrap gap-1.5 justify-start md:justify-end items-center">
              {sizes.map((sz) => {
                const isSelected = sz === selectedSize;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-[11px] font-bold transition-all duration-200 ${
                      isSelected
                        ? 'bg-lywaro-crimson text-white w-7 h-7 rounded-sm flex items-center justify-center border border-lywaro-crimson shadow-[0_0_10px_rgba(213,0,0,0.5)]'
                        : 'text-white/60 hover:text-white px-1.5 py-1 text-[11px]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag to rotate hint with target crosshair icon */}
          <div className="flex items-center gap-2 justify-start md:justify-end text-white/50 pt-1">
            <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-white/70">
              DRAG TO ROTATE
            </span>
          </div>
        </motion.div>

        {/* Scroll indicator matching Image 1 */}
        <motion.div
          style={{ opacity: reducedMotion ? 1 : scrollIndicatorOpacity }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        >
          {/* Mouse outline icon */}
          <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-white/70"
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.3em] text-white/50">
            SCROLL
          </span>
        </motion.div>
      </div>
    </section>
  );
}
