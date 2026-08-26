import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-lywaro-dark/90 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl lg:text-2xl font-black tracking-[0.3em] text-white hover:text-lywaro-crimson transition-colors group"
              aria-label="LYWARO home"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-lywaro-crimson fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 36 36">
                <path d="M4 8 L18 28 L24 19 L16 11 Z M18 28 L32 8 L27 8 L18 21 Z" />
              </svg>
              <span>LYWARO</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-xs font-semibold tracking-[0.2em] transition-colors duration-200 ${
                    (location.pathname + location.search) === link.href
                      ? 'text-lywaro-crimson'
                      : 'text-lywaro-gray hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-5">
              <button
                onClick={openSearch}
                className="p-2 text-lywaro-gray hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className="p-2 text-lywaro-gray hover:text-white transition-colors relative"
                aria-label={`Wishlist (${getCount()} items)`}
              >
                <Heart size={20} strokeWidth={1.5} />
                {getCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-lywaro-crimson rounded-full flex items-center justify-center text-[10px] font-bold">
                    {getCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={openCart}
                className="p-2 text-lywaro-gray hover:text-white transition-colors relative"
                aria-label={`Cart (${getCartCount()} items)`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-lywaro-crimson rounded-full flex items-center justify-center text-[10px] font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <Link
                to="/account"
                className="p-2 text-lywaro-gray hover:text-white transition-colors"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={openSearch}
                className="p-2 text-lywaro-gray hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={openCart}
                className="p-2 text-lywaro-gray hover:text-white transition-colors relative"
                aria-label={`Cart (${getCartCount()} items)`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-lywaro-crimson rounded-full flex items-center justify-center text-[10px] font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-lywaro-gray hover:text-white transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-lywaro-black/98 flex flex-col pt-20 px-6"
          >
            <div className="flex flex-col gap-1 mt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="block py-4 text-2xl font-bold tracking-[0.15em] text-white border-b border-white/5 hover:text-lywaro-crimson transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto mb-12 flex flex-col gap-4">
              <Link
                to="/account"
                className="flex items-center gap-3 py-3 text-lywaro-gray hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User size={20} strokeWidth={1.5} />
                <span className="text-sm font-semibold tracking-wider">ACCOUNT</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 py-3 text-lywaro-gray hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-sm font-semibold tracking-wider">WISHLIST</span>
                {getCount() > 0 && (
                  <span className="ml-auto text-xs bg-lywaro-crimson text-white px-2 py-0.5 rounded-full">{getCount()}</span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
