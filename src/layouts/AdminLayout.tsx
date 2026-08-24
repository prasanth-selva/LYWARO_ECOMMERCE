import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  Menu, X, ChevronLeft, Bell, Search, ChevronDown
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-lywaro-black flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-lywaro-dark border-r border-white/5 transition-all duration-300 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          {sidebarOpen ? (
            <Link to="/" className="text-lg font-black tracking-[0.3em] text-white hover:text-lywaro-crimson transition-colors">
              LYWARO
            </Link>
          ) : (
            <Link to="/" className="text-sm font-black tracking-[0.2em] text-white hover:text-lywaro-crimson transition-colors">
              L
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  isActive
                    ? 'bg-lywaro-crimson/10 text-lywaro-crimson'
                    : 'text-lywaro-gray hover:text-white hover:bg-white/5'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={18} strokeWidth={1.5} />
                {sidebarOpen && <span>{item.label.toUpperCase()}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-white/5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-lywaro-gray hover:text-white transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft size={16} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-lywaro-dark border-r border-white/5 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <Link to="/" className="text-lg font-black tracking-[0.3em] text-white">LYWARO</Link>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-lywaro-gray hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href ||
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
                        isActive
                          ? 'bg-lywaro-crimson/10 text-lywaro-crimson'
                          : 'text-lywaro-gray hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <span>{item.label.toUpperCase()}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-white/5">
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-wider text-lywaro-gray hover:text-white transition-colors">
                  <LogOut size={16} />
                  EXIT ADMIN
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'
      }`}>
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-lywaro-black/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-lywaro-gray hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-lywaro-charcoal border border-white/5 px-3 py-2">
              <Search size={14} className="text-lywaro-gray" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none w-48"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-lywaro-gray hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-lywaro-crimson rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lywaro-charcoal rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="hidden md:block text-xs font-bold text-white tracking-wider">ADMIN</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
