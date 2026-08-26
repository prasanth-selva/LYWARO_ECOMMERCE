import React from 'react';

interface ProductVisualProps {
  slug: string;
  name: string;
  category: string;
  accentColor?: string;
  className?: string;
}

export default function ProductVisual({ slug, name, category, accentColor = '#D50000', className = '' }: ProductVisualProps) {
  // Theme color mapping based on model
  const colors: Record<string, { primary: string; secondary: string; glow: string }> = {
    apex: { primary: '#D50000', secondary: '#151515', glow: '#D50000' },
    vanta: { primary: '#A3A3A3', secondary: '#0B0B0B', glow: '#666666' },
    pulse: { primary: '#FFFFFF', secondary: '#D50000', glow: '#FFFFFF' },
    drift: { primary: '#708090', secondary: '#151515', glow: '#708090' },
    surge: { primary: '#39FF14', secondary: '#050505', glow: '#39FF14' },
    nova: { primary: '#F5E6CC', secondary: '#151515', glow: '#F5E6CC' },
    phantom: { primary: '#D50000', secondary: '#0A0A0A', glow: '#D50000' },
    titan: { primary: '#E67E22', secondary: '#2C3E50', glow: '#E67E22' },
    echo: { primary: '#9CAF88', secondary: '#151515', glow: '#9CAF88' },
  };

  const theme = colors[slug.toLowerCase()] || { primary: accentColor, secondary: '#151515', glow: accentColor };

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#080808] to-[#030303] overflow-hidden select-none ${className}`}>
      {/* Background ambient lighting */}
      <div
        className="absolute w-[80%] h-[80%] rounded-full opacity-20 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }}
      />

      {/* Geometric futuristic background lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={theme.primary} strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </svg>

      {/* Editorial Watermark */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20 tracking-widest uppercase">
        LYWARO // {slug}
      </div>

      {/* Styled Sneaker Graphic Silhouette */}
      <div className="relative z-10 w-3/4 h-3/4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.secondary} />
              <stop offset="50%" stopColor="#1A1A1A" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id={`accent-${slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.primary} />
              <stop offset="100%" stopColor="#FF4444" />
            </linearGradient>
            <filter id={`shadow-${slug}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Sole Cushion Base */}
          <path
            d="M 40 180 Q 120 185 240 180 Q 320 175 360 150 C 370 145 375 160 360 170 C 320 195 240 195 40 190 Z"
            fill={`url(#accent-${slug})`}
            filter={`url(#shadow-${slug})`}
          />

          {/* Outsole Segment Layers */}
          <path
            d="M 35 185 Q 120 192 240 188 Q 330 182 365 165 C 370 175 350 198 240 198 C 120 198 35 192 35 185 Z"
            fill="#090909"
          />

          {/* Main Upper Body */}
          <path
            d="M 50 180 Q 70 120 130 110 Q 180 100 230 75 Q 260 60 280 85 Q 310 110 340 130 Q 355 140 360 155 Q 310 160 240 165 Q 120 170 50 180 Z"
            fill={`url(#grad-${slug})`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />

          {/* Heel counter & TPU overlays */}
          <path
            d="M 50 180 Q 60 130 100 125 C 110 160 80 175 50 180 Z"
            fill={theme.primary}
            opacity="0.85"
          />

          {/* Dynamic Side Swoosh Stripe */}
          <path
            d="M 120 145 Q 200 135 290 100 C 300 108 270 140 180 152 Z"
            fill={`url(#accent-${slug})`}
            opacity="0.9"
          />

          {/* Lacecage details */}
          <path
            d="M 170 110 L 185 85 M 195 105 L 210 80 M 220 100 L 235 75"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Collar & Tongue line */}
          <path
            d="M 230 75 C 240 50 260 45 280 60 L 290 85 Z"
            fill="#151515"
            stroke={theme.primary}
            strokeWidth="1"
          />

          {/* Subtle Reflective Floor Ellipse */}
          <ellipse cx="200" cy="205" rx="150" ry="12" fill="black" opacity="0.6" />
        </svg>
      </div>

      {/* Model Name overlay at bottom right */}
      <div className="absolute bottom-4 right-4 text-right">
        <span className="text-[11px] font-black tracking-widest text-white/30 uppercase">{name}</span>
      </div>
    </div>
  );
}
