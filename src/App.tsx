import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-lywaro-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-lywaro-gray/30 border-t-white rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-bold tracking-[0.2em] text-lywaro-gray">LOADING...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Customer-facing routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
        <Route path="/category/:category" element={<MainLayout><Shop /></MainLayout>} />
        <Route path="/product/:slug" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
        <Route path="/order-confirmation" element={<MainLayout><OrderConfirmation /></MainLayout>} />
        <Route path="/track-order/:id" element={<MainLayout><OrderTracking /></MainLayout>} />
        <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
        <Route path="/account/orders" element={<MainLayout><Account /></MainLayout>} />
        <Route path="/account/addresses" element={<MainLayout><Account /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

        {/* Admin routes — separate layout, no customer navbar/footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-5xl md:text-6xl font-black text-white/10 mb-4">404</p>
              <p className="text-base md:text-lg font-bold tracking-wider text-white/30 mb-2">PAGE NOT FOUND</p>
              <p className="text-sm text-lywaro-gray/50 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300">
                BACK TO HOME
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;
