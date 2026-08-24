import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days across India. Express shipping delivers in 2-3 business days. Orders above ₹5,000 qualify for free standard shipping.' },
  { q: 'What is your return policy?', a: 'We offer free returns within 30 days of delivery. Items must be unworn, undamaged, and in original packaging. To initiate a return, contact our support team with your order number.' },
  { q: 'Can I exchange my order?', a: 'Yes, you can exchange within 30 days. Exchanges are subject to product availability. Contact us with your order number and the size/color you\'d like instead.' },
  { q: 'How do I find my size?', a: 'Our shoes run true to size. We recommend measuring your foot length and referring to our size chart on each product page. If you\'re between sizes, we suggest going half a size up.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets. All transactions are encrypted and secure. EMI options are available for orders above ₹3,000.' },
  { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking link. You can also track your order from your account dashboard under "Orders" or use the track order page with your order number.' },
  { q: 'Are LYWARO shoes sustainable?', a: 'We\'re committed to reducing our environmental impact. Our ECHO line uses recycled materials, and we\'re working towards 100% sustainable packaging by 2027. Visit our About page to learn more about our sustainability initiatives.' },
  { q: 'Do you offer wholesale or bulk orders?', a: 'For wholesale inquiries, partnerships, or bulk orders of 10+ units, please contact us at wholesale@lywaro.com with your details.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">SUPPORT</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-4">FREQUENTLY ASKED</h1>
        <p className="text-sm text-lywaro-gray mb-12">Everything you need to know about LYWARO.</p>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-bold tracking-wider text-white group-hover:text-lywaro-crimson transition-colors pr-4">
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp size={16} className="text-lywaro-crimson flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-lywaro-gray flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-lywaro-gray leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-lywaro-charcoal border border-white/5 text-center">
          <p className="text-sm text-lywaro-gray mb-2">Still have questions?</p>
          <a href="/contact" className="text-sm font-bold tracking-wider text-lywaro-crimson hover:text-white transition-colors">
            CONTACT US →
          </a>
        </div>
      </div>
    </div>
  );
}
