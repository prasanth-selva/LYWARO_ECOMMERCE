import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import SearchOverlay from '../components/SearchOverlay';
import ToastContainer from '../components/Toast';
import { useLenis } from '../hooks/useLenis';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-lywaro-black text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />
    </div>
  );
}
