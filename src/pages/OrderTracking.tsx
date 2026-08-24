import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const statusSteps = [
  { key: 'placed', label: 'ORDER PLACED', time: 'Aug 15, 2026 · 2:30 PM' },
  { key: 'confirmed', label: 'CONFIRMED', time: 'Aug 15, 2026 · 2:35 PM' },
  { key: 'packed', label: 'PACKED', time: 'Aug 16, 2026 · 10:00 AM' },
  { key: 'shipped', label: 'SHIPPED', time: 'Aug 17, 2026 · 3:15 PM' },
  { key: 'out_for_delivery', label: 'OUT FOR DELIVERY', time: 'Pending' },
  { key: 'delivered', label: 'DELIVERED', time: 'Pending' },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  // For mock: show first 4 steps as completed
  const currentStep = 3;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link to="/account" className="inline-flex items-center gap-2 text-xs text-lywaro-gray hover:text-white transition-colors mb-6">
          <ArrowLeft size={12} /> BACK TO ACCOUNT
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">TRACKING</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
          ORDER #{id || 'LYW-260815'}
        </h1>
        <p className="text-sm text-lywaro-gray mb-10">Estimated delivery: Aug 20, 2026</p>

        {/* Timeline */}
        <div className="relative">
          {statusSteps.map((step, i) => {
            const isCompleted = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex gap-4 pb-8 last:pb-0 relative">
                {/* Line */}
                {i < statusSteps.length - 1 && (
                  <div className={`absolute left-[11px] top-6 w-px h-full ${isCompleted ? 'bg-lywaro-crimson' : 'bg-white/10'}`} />
                )}
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                  isCompleted
                    ? isCurrent
                      ? 'border-lywaro-crimson bg-lywaro-crimson'
                      : 'border-lywaro-crimson bg-lywaro-crimson'
                    : 'border-white/20 bg-lywaro-dark'
                }`}>
                  {isCompleted && !isCurrent && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                {/* Content */}
                <div>
                  <p className={`text-sm font-bold tracking-wider ${isCompleted ? 'text-white' : 'text-lywaro-gray/40'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-lywaro-gray/60 mt-0.5">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
