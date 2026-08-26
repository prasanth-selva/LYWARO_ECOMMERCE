import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSearch } from '../context/SearchContext';

const navLinks = [
  { label: 'COLLECTION', href: '/shop' },
  { label: 'MEN', href: '/shop?gender=Men' },
  { label: 'WOMEN', href: '/shop?gender=Women' },
  { label: 'ABOUT', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getCartCount, openCart } = useCart();
  const { getCount } = useWishlist();
  const { openSearch } = useSearch();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    location.pathname === href || (location.pathname + location.search) === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center h-[60px] lg:h-[68px]">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 group"
              aria-label="LYWARO home"
            >
              {/* Red lightning bolt emblem matching reference */}
              <svg
                className="w-[22px] h-[22px] text-lywaro-crimson fill-current drop-shadow-[0_0_8px_rgba(213,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
              </svg>
              <span className="text-white font-black tracking-[0.28em] text-[15px] lg:text-[17px] group-hover:text-lywaro-crimson transition-colors duration-300">
                LYWARO
              </span>
            </Link>

            {/* ── Centre Nav Links ── */}
            <div className="hidden lg:flex items-center gap-9 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative text-[11px] font-bold tracking-[0.22em] transition-colors duration-200 pb-0.5 ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-lywaro-crimson"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Right Icons ── */}
            <div className="hidden lg:flex items-center gap-1 ml-auto">
              {/* Search */}
              <button
                onClick={openSearch}
                className="p-2.5 text-white/50 hover:text-white transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.8} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 text-white/50 hover:text-white transition-colors duration-200"
                aria-label={`Wishlist (${getCount()} items)`}
              >
                <Heart size={18} strokeWidth={1.8} />
                {getCount() > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-lywaro-crimson rounded-full flex items-center justify-center text-[9px] font-black text-white">
                    {getCount()}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-white/50 hover:text-white transition-colors duration-200"
                aria-label={`Cart (${getCartCount()} items)`}
              >
                <ShoppingBag size={18} strokeWidth={1.8} />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 min-w-[14px] h-3.5 bg-lywaro-crimson rounded-full flex items-center justify-center text-[9px] font-black text-white px-0.5">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 text-white/50 hover:text-white transition-colors duration-200 ml-1"
                aria-label="Open menu"
              >
                <Menu size={18} strokeWidth={1.8} />
              </button>
            </div>

            {/* ── Mobile Right ── */}
            <div className="flex lg:hidden items-center gap-1 ml-auto">
              <button onClick={openSearch} className="p-2 text-white/60 hover:text-white" aria-label="Search">
                <Search size={18} strokeWidth={1.8} />
              </button>
              <button onClick={openCart} className="relative p-2 text-white/60 hover:text-white" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.8} />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-lywaro-crimson rounded-full flex items-center justify-center text-[9px] font-black">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-white/60 hover:text-white"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-black/97 backdrop-blur-xl flex flex-col px-6 pt-20"
          >
            <div className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    className="block py-5 text-[26px] font-black tracking-[0.12em] text-white/80 border-b border-white/5 hover:text-lywaro-crimson transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto mb-10 flex flex-col gap-4 pt-6 border-t border-white/5">
              <Link to="/wishlist" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                <Heart size={18} strokeWidth={1.5} />
                <span className="text-sm font-bold tracking-widest">WISHLIST</span>
                {getCount() > 0 && <span className="ml-auto text-xs bg-lywaro-crimson text-white px-2 py-0.5 rounded-full">{getCount()}</span>}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
