import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        const scrollPos = window.scrollY + 220;
        const contactEl = document.getElementById('contact');
        const reviewsEl = document.getElementById('reviews');
        const categoryEl = document.getElementById('category');
        const featuresEl = document.getElementById('features');
        const aboutEl = document.getElementById('about');

        if (contactEl && scrollPos >= contactEl.offsetTop) {
          setActiveSection('contact');
        } else if (reviewsEl && scrollPos >= reviewsEl.offsetTop) {
          setActiveSection('reviews');
        } else if (categoryEl && scrollPos >= categoryEl.offsetTop) {
          setActiveSection('category');
        } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
          setActiveSection('features');
        } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserRole(localStorage.getItem('userRole'));
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserRole(null);
    window.dispatchEvent(new Event('storage'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const scrollToSection = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navbarHeight = 65;
        const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    };

    if (location.pathname === '/') {
      scrollToSection();
    } else {
      navigate('/');
      setTimeout(scrollToSection, 300);
    }
    setIsOpen(false);
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    }
    setIsOpen(false);
  };

  if (isDashboard || location.pathname.startsWith('/admin')) return null;

  const navItems = [
    { id: 'home',     label: 'Home',       isRoute: true, path: '/' },
    { id: 'about',    label: 'About Us',   isAnchor: true },
    { id: 'features', label: 'Features',   isAnchor: true },
    { id: 'category', label: 'Category',   isAnchor: true },
    { id: 'reviews',  label: 'Review',     isAnchor: true },
    { id: 'contact',  label: 'Contact Us', isAnchor: true },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-white py-3.5 border-b border-slate-100 ${isScrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          
          {/* Logo */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Rent<span className="text-[var(--primary)]">Ease</span>
            </span>
          </Link>

          {/* Navigation Links centered: Home | About Us | Features | Category | Review | Contact Us */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center justify-center gap-5 lg:gap-7 flex-1">
              {navItems.map((item) => {
                const isActive = 
                  (item.isRoute && item.path === '/' && location.pathname === '/' && activeSection === 'home') ||
                  (item.isRoute && item.path !== '/' && location.pathname === item.path) ||
                  (item.isAnchor && location.pathname === '/' && activeSection === item.id);

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={item.path === '/' ? handleHomeClick : undefined}
                      className={`group font-semibold text-base transition-all relative py-1 ${
                        isActive 
                          ? 'text-[var(--primary)] font-bold' 
                          : 'text-slate-700 hover:text-[var(--primary)]'
                      }`}
                    >
                      {item.label}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleSectionClick(e, item.id)}
                    className={`group font-semibold text-base transition-all relative py-1 cursor-pointer ${
                      isActive 
                        ? 'text-[var(--primary)] font-bold' 
                        : 'text-slate-700 hover:text-[var(--primary)]'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Action Icons */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-slate-100 border-none rounded-full py-2 px-9 focus:ring-2 focus:ring-red-500/20 w-36 lg:w-44 text-sm transition-all"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              </div>

              <Link to="/wishlist" className="relative p-2 text-slate-700 hover:text-[var(--primary)] transition-colors" title="Wishlist">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
              </Link>

              <Link to="/cart" className="relative p-2 text-slate-700 hover:text-[var(--primary)] transition-colors" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
              </Link>
              
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {userRole === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-700 font-bold transition-all text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-700 font-bold transition-all text-xs">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 btn-primary !py-2 !px-4 !rounded-full text-sm">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthPage && (
            <div className="md:hidden flex items-center gap-3">
              <Link to="/wishlist" className="relative p-1.5 text-slate-700">
                <Heart className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
              </Link>
              <Link to="/cart" className="relative p-1.5 text-slate-700">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-[var(--primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-slate-700">
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link 
                  key={item.id}
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-semibold text-slate-800 hover:text-[var(--primary)] border-b border-slate-50"
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  onClick={(e) => handleSectionClick(e, item.id)}
                  className="block px-3 py-3 text-base font-semibold text-slate-800 hover:text-[var(--primary)] border-b border-slate-50 cursor-pointer"
                >
                  {item.label}
                </a>
              )
            ))}

            {userRole !== 'admin' && isLoggedIn && (
              <Link 
                to="/my-rentals" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-700 border-b border-slate-50"
              >
                My Rentals
              </Link>
            )}

            <div className="pt-4 flex flex-col gap-3">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="btn-primary text-center">Logout</button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center">Login / Register</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
