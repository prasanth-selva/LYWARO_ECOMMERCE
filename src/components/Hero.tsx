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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] bg-lywaro-black overflow-hidden"
      aria-label="Hero section"
    >
      {/* Sticky hero container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background atmosphere */}
        <motion.div
          style={{ y: reducedMotion ? 0 : bgY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-lywaro-black via-lywaro-dark to-lywaro-black" />

          {/* Crimson glow - follows mouse on desktop */}
          <div
            className="absolute top-1/2 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, #D50000 0%, transparent 70%)',
              transform: reducedMotion
                ? 'translate(30%, -50%)'
                : `translate(${30 + mousePos.x * 3}%, ${-50 + mousePos.y * 3}%)`,
              transition: 'transform 0.8s ease-out',
            }}
          />

          {/* Noise grain */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        {/* Large APEX background text */}
        <motion.div
          style={{ y: reducedMotion ? 0 : apexY, opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="text-[25vw] md:text-[20vw] lg:text-[15vw] font-black text-white/[0.02] tracking-[0.2em]"
            aria-hidden="true"
          >
            APEX
          </span>
        </motion.div>

        {/* 3D Sneaker — centered on mobile, right on desktop */}
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
              md:absolute md:right-[5%] md:top-[5%]
              md:w-[70%] md:h-[80%] md:max-w-3xl
              absolute right-0 top-[15%]
              w-[85%] h-[50%] max-w-lg
            `}
          >
            <SneakerScene onInteractionStart={() => setHasInteracted(true)} />
          </div>
        </motion.div>

        {/* Hero Content — responsive layout */}
        <motion.div
          style={{ y: reducedMotion ? 0 : contentY, opacity }}
          className="absolute inset-0 flex flex-col z-10
            px-5 pt-24 pb-32
            md:justify-center md:px-12 lg:px-20 xl:px-24
          "
        >
          <div className="max-w-xl">
            {/* Small label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-4 md:mb-6"
            >
              <div className="w-8 h-px bg-lywaro-crimson" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">
                NEW DROP — 2026
              </span>
            </motion.div>

            {/* Product code */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs font-mono text-lywaro-gray tracking-widest mb-2"
            >
              LYWARO / 001
            </motion.p>

            {/* Category */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[10px] font-bold tracking-[0.3em] text-lywaro-gray mb-4 md:mb-6"
            >
              ENGINEERED FOR MOTION
            </motion.p>

            {/* Main headline — smaller on mobile */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] mb-4 md:mb-6"
            >
              <span className="text-white">MOVE</span>
              <br />
              <span className="text-lywaro-crimson">DIFFERENT.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xs md:text-sm text-lywaro-gray max-w-sm leading-relaxed mb-6 md:mb-8"
            >
              Engineered for motion. Designed for those who refuse ordinary.
            </motion.p>

            {/* CTAs — stacked on mobile, inline on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link
                to="/shop"
                className="group flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 md:px-8 md:py-4 text-[11px] md:text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
              >
                EXPLORE COLLECTION
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/product/apex"
                className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 md:px-8 md:py-4 text-[11px] md:text-xs font-bold tracking-[0.15em] hover:border-white/50 transition-colors"
              >
                VIEW DETAILS
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Product info — bottom-right on desktop, bottom-center on mobile */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-20 md:bottom-16 lg:bottom-24 z-10
            left-4 right-4 md:left-auto md:right-12 lg:right-16
            text-center md:text-right
          "
        >
          <p className="text-base md:text-lg lg:text-xl font-black tracking-wider text-white mb-1">LYWARO APEX</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-2">{formatPrice(8499)}</p>
          <p className="text-[11px] md:text-xs text-lywaro-gray tracking-wider mb-1">BLACK / CRIMSON</p>
          <p className="text-[11px] md:text-xs text-lywaro-gray/50 tracking-wider mb-3 md:mb-4">
            Sizes 35–45
          </p>

          {/* Interaction hint */}
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center gap-2 md:justify-end text-lywaro-gray/40"
            >
              {isMobile ? (
                <>
                  <Move size={12} />
                  <span className="text-[10px] font-semibold tracking-[0.2em]">SWIPE TO ROTATE</span>
                </>
              ) : (
                <>
                  <RotateCcw size={12} />
                  <span className="text-[10px] font-semibold tracking-[0.2em]">DRAG TO ROTATE</span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-lywaro-gray/20">· SCROLL TO ZOOM · DBL-CLICK TO RESET</span>
                </>
              )}
            </motion.div>
          )}
          {hasInteracted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex items-center gap-2 justify-end text-lywaro-gray/25"
            >
              <Maximize2 size={10} />
              <span className="text-[9px] font-semibold tracking-[0.2em]">SCROLL TO ZOOM · DBL-CLICK TO RESET</span>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: reducedMotion ? 1 : scrollIndicatorOpacity }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-lywaro-gray/40">SCROLL</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-6 md:h-8 bg-gradient-to-b from-lywaro-gray/40 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
