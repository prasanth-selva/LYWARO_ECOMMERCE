import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Best Sellers', href: '/shop' },
    { label: 'Running', href: '/shop?category=Running' },
    { label: 'Training', href: '/shop?category=Training' },
    { label: 'Lifestyle', href: '/shop?category=Lifestyle' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Careers', href: '/about' },
  ],
  support: [
    { label: 'Shipping', href: '/faq' },
    { label: 'Returns', href: '/faq' },
    { label: 'Size Guide', href: '/faq' },
    { label: 'Track Order', href: '/track-order/LYW-260815' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-lywaro-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-[0.3em] text-white">
              LYWARO
            </Link>
            <p className="mt-4 text-sm text-lywaro-gray leading-relaxed max-w-xs">
              Engineered for motion. Designed for those who refuse ordinary.
            </p>
            <p className="mt-4 text-xs text-lywaro-gray/50 tracking-[0.3em] font-semibold">
              MOVE DIFFERENT.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white mb-6">SHOP</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-lywaro-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white mb-6">COMPANY</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-lywaro-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white mb-6">SUPPORT</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-lywaro-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-lywaro-gray/50">
            © 2026 LYWARO. All rights reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <span className="text-xs text-lywaro-gray/50">Privacy Policy</span>
            <span className="text-xs text-lywaro-gray/50">Terms of Service</span>
            <span className="text-xs text-lywaro-gray/50">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
