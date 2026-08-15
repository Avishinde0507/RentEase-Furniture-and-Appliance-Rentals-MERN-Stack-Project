import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from './apiConfig';

// Lazy Loaded Pages for high-speed initial page loads & code-splitting
const Home = lazy(() => import('./pages/Home'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const MyRentals = lazy(() => import('./pages/MyRentals'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';

// Fast Loading Spinner
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-red-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
  </div>
);

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  // Pre-warm backend API on first visit so Render instance wakes up immediately
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`, { method: 'GET' }).catch(() => {});
  }, []);

  return (
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Toaster position="top-right" />
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductListing />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-rentals" element={<MyRentals />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/dashboard" element={<CustomerDashboard />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  );
}

export default App;

