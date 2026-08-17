import React, { useEffect, Suspense, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from './apiConfig';

// Pages — lazy loaded for performance
const Home = React.lazy(() => import('./pages/Home'));
const ProductListing = React.lazy(() => import('./pages/ProductListing'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const MyRentals = React.lazy(() => import('./pages/MyRentals'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const CustomerDashboard = React.lazy(() => import('./pages/CustomerDashboard'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';

// ─── Error Boundary ─────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[RentEase] Runtime Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif',
          background: '#f8f9fa',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e272e', marginBottom: '0.5rem' }}>
            RentEase — Something went wrong
          </h1>
          <p style={{ color: '#636e72', marginBottom: '2rem', maxWidth: '400px' }}>
            We encountered an unexpected error. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#ff4d4d',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && (
            <pre style={{
              marginTop: '2rem',
              background: '#fff',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#e63e3e',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Page Loading Fallback ───────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #ff4d4d',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: '#636e72', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
      Loading...
    </p>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── Scroll To Top ───────────────────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  // Pre-warm backend API on initial visit (fire-and-forget, no blank screen)
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`, { method: 'GET' })
      .catch(() => { /* backend may be sleeping on free tier — safe to ignore */ });
  }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
