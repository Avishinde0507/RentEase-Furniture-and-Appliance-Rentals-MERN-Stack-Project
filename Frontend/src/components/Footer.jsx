import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, MessageSquare, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/admin') || location.pathname === '/dashboard') {
    return null;
  }

  const handleQuickLink = (e, sectionId) => {
    e.preventDefault();
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
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Rent<span className="text-[var(--primary)]">Ease</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Premium furniture and appliance rentals for the modern Indian home. Experience luxury without the commitment of buying.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" onClick={handleHomeClick} className="hover:text-[var(--primary)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleQuickLink(e, 'about')} className="hover:text-[var(--primary)] transition-colors cursor-pointer block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleQuickLink(e, 'features')} className="hover:text-[var(--primary)] transition-colors cursor-pointer block">
                  Features
                </a>
              </li>
              <li>
                <a href="#category" onClick={(e) => handleQuickLink(e, 'category')} className="hover:text-[var(--primary)] transition-colors cursor-pointer block">
                  Categories
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => handleQuickLink(e, 'reviews')} className="hover:text-[var(--primary)] transition-colors cursor-pointer block">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleQuickLink(e, 'contact')} className="hover:text-[var(--primary)] transition-colors cursor-pointer block">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Categories</h4>
            <ul className="space-y-4">
              <li><Link to="/products?cat=Furniture" className="hover:text-[var(--primary)] transition-colors">Furniture</Link></li>
              <li><Link to="/products?cat=Appliances" className="hover:text-[var(--primary)] transition-colors">Appliances</Link></li>
              <li><Link to="/products?cat=Office" className="hover:text-[var(--primary)] transition-colors">Office</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)] mt-1 flex-shrink-0" />
                <span>Main Road , Talegaon Dabhade , Pune , 410507</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                <span>+91 9518386406</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                <span>renteasefurniturerentals@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} RentEase Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
