import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className={className}>
      {children}
    </motion.div>
  );
}

const sections = [
  {
    tag: 'OUR STORY',
    title: 'WE DON\'T FOLLOW MOTION.\nWE CREATE IT.',
    text: 'LYWARO was born from a simple belief: movement should be an expression, not a compromise. Founded in 2024, we set out to build footwear that bridges the gap between high-performance engineering and street-level style.',
  },
  {
    tag: 'PHILOSOPHY',
    title: 'ENGINEERED.\nNOT DECORATED.',
    text: 'Every element serves a purpose. Our design philosophy strips away the unnecessary, leaving only what performs. We don\'t follow trends — we engineer them. The result is footwear that looks as intentional as it feels.',
  },
  {
    tag: 'DESIGN',
    title: 'BORN FROM\nTHE FUTURE.',
    text: 'Our design language draws from aerospace engineering, architectural minimalism, and the raw energy of urban movement. Each silhouette is designed to feel inevitable — like it always existed and was waiting to be discovered.',
  },
  {
    tag: 'PERFORMANCE',
    title: 'MOVE WITH\nPURPOSE.',
    text: 'LYWARO products are tested in the most demanding conditions. From marathon streets to training floors, our technology is built to respond to real movement. FLUXFOAM, CARBONBLADE, and STEALTHSTEP aren\'t just names — they\'re promises.',
  },
  {
    tag: 'THE FUTURE',
    title: 'THIS IS\nJUST THE\nBEGINNING.',
    text: 'We\'re just getting started. LYWARO is building the future of movement — one step at a time. Expect innovation. Expect intention. Expect to move different.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 lg:py-32">
        <FadeIn>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-lywaro-crimson" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">ABOUT LYWARO</span>
          </div>
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.9]">
            WE DON'T FOLLOW<br />
            MOTION.<br />
            <span className="text-lywaro-crimson">WE CREATE IT.</span>
          </h1>
        </FadeIn>
      </section>

      {/* Sections */}
      {sections.map((section, i) => (
        <section key={section.tag} className={`px-4 sm:px-6 lg:px-8 py-20 lg:py-32 ${i % 2 === 1 ? 'bg-lywaro-dark' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson mb-4 block">{section.tag}</span>
                  <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight whitespace-pre-line">
                    {section.title}
                  </h2>
                </div>
                <div className="lg:pt-8">
                  <p className="text-sm text-lywaro-gray leading-relaxed">{section.text}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-lywaro-dark">
        <FadeIn className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">READY TO MOVE DIFFERENT?</h2>
          <p className="text-sm text-lywaro-gray mb-8">Explore the full collection and find your perfect pair.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
          >
            SHOP NOW <ArrowRight size={14} />
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
