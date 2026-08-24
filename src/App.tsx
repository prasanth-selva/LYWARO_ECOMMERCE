import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
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
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/track-order/:id" element={<OrderTracking />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<Account />} />
          <Route path="/account/addresses" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <div className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-black text-white/10 mb-4">404</p>
                <p className="text-lg font-bold tracking-wider text-white/30 mb-2">PAGE NOT FOUND</p>
                <p className="text-sm text-lywaro-gray/50 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300">
                  BACK TO HOME
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
