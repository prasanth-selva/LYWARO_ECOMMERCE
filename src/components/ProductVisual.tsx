import React from 'react';

interface ProductVisualProps {
  slug: string;
  name: string;
  category: string;
  accentColor?: string;
  className?: string;
}

/* Per-model colour themes */
const THEMES: Record<string, { primary: string; secondary: string; sole: string; upper: string }> = {
  apex:    { primary: '#D50000', secondary: '#111111', sole: '#D50000',  upper: '#181818' },
  vanta:   { primary: '#888888', secondary: '#0d0d0d', sole: '#444444',  upper: '#1a1a1a' },
  pulse:   { primary: '#D50000', secondary: '#e8e8e8', sole: '#D50000',  upper: '#f0f0f0' },
  drift:   { primary: '#8899aa', secondary: '#1a1a2e', sole: '#778899',  upper: '#22273a' },
  surge:   { primary: '#39FF14', secondary: '#080808', sole: '#2edd0e',  upper: '#101010' },
  nova:    { primary: '#c8a96e', secondary: '#f8f2e8', sole: '#b89050',  upper: '#faf4ea' },
  phantom: { primary: '#D50000', secondary: '#0a0a0a', sole: '#880000',  upper: '#151515' },
  titan:   { primary: '#e07020', secondary: '#1e2430', sole: '#c05a10',  upper: '#1e2430' },
  echo:    { primary: '#7aaa66', secondary: '#1a2218', sole: '#5a9048',  upper: '#1e2a1a' },
};

export default function ProductVisual({ slug, name, accentColor = '#D50000', className = '' }: ProductVisualProps) {
  const t = THEMES[slug.toLowerCase()] ?? { primary: accentColor, secondary: '#131313', sole: accentColor, upper: '#181818' };
  const isLight = t.secondary.startsWith('#f') || t.secondary.startsWith('#e');
  const gradId  = `g-${slug}`;
  const glowId  = `glow-${slug}`;
  const soleId  = `sole-${slug}`;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${t.secondary}ee 0%, #080808 100%)` }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 55% 55%, ${t.primary}22 0%, transparent 70%)`,
        }}
      />

      {/* Geometric grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${slug}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${slug})`} />
      </svg>

      {/* LYWARO watermark */}
      <span className="absolute top-3 left-3 text-[9px] font-black tracking-[0.3em] text-white/10 uppercase select-none">
        LYWARO // {slug.toUpperCase()}
      </span>

      {/* ── Shoe SVG ── */}
      <div className="relative z-10 w-[88%] h-[72%] drop-shadow-2xl">
        <svg
          viewBox="0 0 440 260"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0 18px 32px rgba(0,0,0,0.9)) drop-shadow(0 0 18px ${t.primary}55)` }}
        >
          <defs>
            {/* Upper body gradient */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={isLight ? '#ffffff' : '#2a2a2a'} />
              <stop offset="40%"  stopColor={t.upper} />
              <stop offset="100%" stopColor="#060606" />
            </linearGradient>

            {/* Accent / sole gradient */}
            <linearGradient id={soleId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={t.primary} />
              <stop offset="60%"  stopColor={t.primary} />
              <stop offset="100%" stopColor={`${t.primary}88`} />
            </linearGradient>

            {/* Glow filter */}
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── Outsole / midsole base ── */}
          <ellipse cx="216" cy="218" rx="168" ry="14" fill="#080808" opacity="0.7" />

          {/* Thick rubber outsole */}
          <path
            d="M 52 196 Q 56 210 100 214 Q 180 220 280 216 Q 350 213 382 200 Q 390 194 386 186 Q 378 198 340 202 Q 240 208 110 204 Q 70 202 52 196 Z"
            fill="#0a0a0a"
          />

          {/* Midsole – accent colour */}
          <path
            d="M 55 188 Q 60 200 106 205 Q 190 212 284 208 Q 352 205 384 192 Q 390 186 382 180
               Q 370 190 330 196 Q 230 202 110 198 Q 72 196 55 188 Z"
            fill={`url(#${soleId})`}
          />

          {/* Midsole highlight streak */}
          <path
            d="M 130 195 Q 220 198 320 193"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Segmented outsole pods */}
          {[100, 145, 190, 240, 288, 335].map((x, i) => (
            <rect
              key={i}
              x={x} y={202}
              width={i < 3 ? 32 : 28} height={10}
              rx={3}
              fill="#0d0d0d"
              stroke={t.primary}
              strokeWidth="0.4"
              opacity="0.85"
            />
          ))}

          {/* ── Main upper body ── */}
          <path
            d="M 58 188
               Q 64 145 100 125
               Q 140 108 190 90
               Q 225 78 262 72
               Q 295 68 316 80
               Q 340 96 358 118
               Q 374 138 380 162
               Q 382 174 378 182
               Q 340 188 270 192
               Q 175 196 58 188 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />

          {/* Upper surface sheen */}
          <path
            d="M 100 140 Q 200 118 340 138"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
            style={{ filter: 'blur(6px)' }}
          />

          {/* ── Heel counter ── */}
          <path
            d="M 58 188 Q 64 145 98 128 Q 90 155 75 178 Z"
            fill={t.primary}
            opacity="0.9"
          />
          <path
            d="M 58 188 Q 68 155 96 135 Q 88 158 76 180 Z"
            fill="rgba(255,255,255,0.06)"
          />

          {/* ── Dynamic side swoosh stripe ── */}
          <path
            d="M 105 158 Q 180 140 294 108 Q 316 120 280 148 Q 200 162 118 168 Z"
            fill={`url(#${soleId})`}
            opacity="0.88"
          />

          {/* Swoosh highlight edge */}
          <path
            d="M 108 155 Q 185 138 292 108"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* ── Toe box overlay ── */}
          <path
            d="M 290 108 Q 320 98 348 116 Q 368 132 372 158 Q 348 140 316 130 Q 298 124 290 108 Z"
            fill={isLight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'}
          />

          {/* ── Lace cage / eyelets ── */}
          {[190, 215, 242, 268].map((x, i) => (
            <g key={i}>
              <line
                x1={x} y1={i % 2 === 0 ? 110 : 115}
                x2={x + 14} y2={i % 2 === 0 ? 90 : 95}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx={x} cy={i % 2 === 0 ? 110 : 115} r="2.5" fill={t.primary} opacity="0.8" />
            </g>
          ))}

          {/* Laces horizontal */}
          <path
            d="M 193 108 Q 230 100 264 106"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 5"
          />

          {/* ── Tongue & collar ── */}
          <path
            d="M 250 78 Q 275 58 300 66 L 312 86 Q 292 80 270 90 Z"
            fill={isLight ? '#e0e0e0' : '#1e1e1e'}
            stroke={t.primary}
            strokeWidth="0.8"
          />
          <path
            d="M 252 80 Q 275 62 298 70"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* ── Ankle collar ── */}
          <path
            d="M 265 72 Q 310 60 340 88"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ filter: 'blur(4px)' }}
          />

          {/* ── Reflective floor ellipse ── */}
          <ellipse
            cx="216" cy="222"
            rx="155" ry="9"
            fill={t.primary}
            opacity="0.08"
          />

          {/* Floor hard reflection line */}
          <path
            d="M 88 222 Q 216 228 340 222"
            fill="none"
            stroke={t.primary}
            strokeWidth="1"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Model name watermark */}
      <span className="absolute bottom-3 right-3 text-[10px] font-black tracking-[0.28em] text-white/20 uppercase">
        {name}
      </span>
    </div>
  );
}
