import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Clock, IndianRupee, Globe, Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmittingContact(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Thank you! Your message has been sent successfully.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please check your network connection.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleBrowseProducts = (e) => {
    if (e) e.preventDefault();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/products');
    } else {
      navigate('/login');
    }
  };

  const categories = [
    { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', count: '200+ Products' },
    { name: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', count: '150+ Products' },
    { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800', count: '60+ Products' },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rentease_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
        } else {
          setReviews(initial);
        }
      } else {
        setReviews(initial);
        localStorage.setItem('rentease_reviews', JSON.stringify(initial));
      }
    } catch {
      setReviews(initial);
    }

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => elem.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }, []);

  const columns = [[], [], []];
  reviews.forEach((r, i) => columns[i % 3].push(r));

  return (
    <div className="overflow-x-hidden bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center pt-20 pb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.65]" 
            alt="Hero Bg" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-[var(--primary)] text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-red-500/30">
              #1 Rental Platform in India
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Live Better, <br />
              <span className="text-[var(--primary)]">Pay Less Monthly</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-xl">
              Rent premium furniture and home appliances starting at just <span className="font-bold text-white">₹299/mo</span>. Free delivery, maintenance, and relocation!
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleBrowseProducts} className="btn-primary flex items-center gap-2 group text-base px-7 py-3.5 shadow-xl shadow-red-500/25">
                Browse Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="min-h-[calc(100vh-72px)] flex flex-col justify-center py-20 md:py-28 bg-slate-50 border-b border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-3 block">Our Story</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15] tracking-tight">
                Making Quality Living <br /> <span className="text-[var(--primary)]">Affordable for All</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                Founded in 2024, RentEase started with a simple mission: To enable modern Indians to live in their dream homes without the burden of heavy upfront ownership costs. We provide premium furniture and appliances on flexible rental plans.
              </p>
              <div className="flex flex-wrap gap-6 md:gap-8 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-4xl font-extrabold text-[var(--primary)] mb-1">50K+</p>
                  <p className="text-slate-500 font-semibold text-sm">Happy Customers</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-4xl font-extrabold text-slate-900 mb-1">15+</p>
                  <p className="text-slate-500 font-semibold text-sm">Cities Covered</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: <ShieldCheck />, title: 'Quality First', desc: 'Rigorous 25-point quality check before every delivery.' },
                  { icon: <Heart />, title: 'Customer Love', desc: 'Dedicated support for a hassle-free experience.' },
                  { icon: <Globe />, title: 'Sustainability', desc: 'Promoting a circular economy to reduce waste.' }
                ].map((v, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[var(--primary)] mb-3 group-hover:scale-110 transition-transform">
                      {React.cloneElement(v.icon, { className: 'w-5 h-5' })}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{v.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-red-100 rounded-[3rem] -rotate-2"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                className="rounded-[2.5rem] relative z-10 shadow-2xl w-full h-[480px] object-cover"
                alt="About RentEase Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Separated Features Section */}
      <section id="features" className="min-h-[calc(100vh-72px)] flex flex-col justify-center py-20 md:py-28 bg-white border-b border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-14">
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-2 block">Why Choose Us</span>
            <h2 className="section-title">RentEase Features</h2>
            <p className="text-slate-500 text-sm md:text-base mt-1">Enjoy a hassle-free rental experience with our premium benefits</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <Truck />, title: 'Free Delivery', desc: 'Fast delivery within 48 hours to your doorstep' },
              { icon: <ShieldCheck />, title: 'Free Service', desc: 'Lifetime free maintenance & quality check' },
              { icon: <Clock />, title: 'Flexible Tenure', desc: 'Rent for 3 to 24+ months as per your need' },
              { icon: <IndianRupee />, title: 'Best Prices', desc: 'Lowest rental rates guaranteed across India' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100/80 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white text-[var(--primary)] rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                  {React.cloneElement(f.icon, { className: 'w-7 h-7' })}
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">{f.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="category" className="min-h-[calc(100vh-72px)] flex flex-col justify-center py-20 md:py-28 bg-slate-50 border-b border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-14">
            <div>
              <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-2 block">Categories</span>
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-slate-500 text-sm md:text-base mt-1">Explore our curated collections for every room in your house</p>
            </div>
            <button onClick={handleBrowseProducts} className="text-[var(--primary)] font-bold flex items-center gap-1 hover:underline text-sm md:text-base">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                onClick={() => {
                  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                  if (isLoggedIn) {
                    navigate(`/products?cat=${encodeURIComponent(cat.name)}`);
                  } else {
                    navigate('/login');
                  }
                }}
                whileHover={{ y: -8 }}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-slate-300 text-xs font-medium">{cat.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section Grid */}
      <section id="reviews" className="min-h-[calc(100vh-72px)] flex flex-col justify-center py-20 md:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-14 text-center md:text-left">
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-2 block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Over 1.5 Lac <span className="text-[var(--primary)]">Happy Subscribers</span>
            </h2>
            <p className="text-slate-500 text-base">Here's what our verified users have to say about their RentEase experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="space-y-6">
                {col.map((r, i) => (
                  <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-900 text-base mb-1">{r.name}</h4>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      <span className="text-slate-900 font-bold text-xs mr-1">
                        {(typeof r.rating === 'number' ? r.rating : (parseFloat(r.rating) || 5)).toFixed(1)}
                      </span>
                      {[...Array(5)].map((_, starIdx) => {
                        const rVal = typeof r.rating === 'number' ? r.rating : (parseFloat(r.rating) || 5);
                        return (
                          <Star key={starIdx} className={`w-3.5 h-3.5 ${starIdx < rVal ? 'fill-current' : 'text-slate-200'}`} />
                        );
                      })}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="min-h-[calc(100vh-72px)] flex flex-col justify-center py-20 md:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-14">
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-2 block">Contact Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Get in Touch</h2>
            <p className="text-slate-500 text-sm md:text-base">Have questions about our rental plans? Our dedicated team is here to assist you 24/7.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--primary)]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                  <p className="text-slate-500 text-sm mb-1">For support, inquiries & feedback</p>
                  <a href="mailto:renteasefurniturerentals@gmail.com" className="text-[var(--primary)] font-semibold text-sm break-all hover:underline">renteasefurniturerentals@gmail.com</a>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--primary)]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                  <p className="text-slate-500 text-sm mb-1">Monday – Saturday, 9am – 6pm IST</p>
                  <a href="tel:+919518386406" className="text-[var(--primary)] font-semibold text-sm hover:underline">+91 9518386406</a>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--primary)]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Visit Us</h4>
                  <p className="text-slate-500 text-sm">Main Road, Talegaon Dabhade, Pune – 410507</p>
                </div>
              </div>
            </div>
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[var(--primary)]" /> Send us a Message
                </h3>
                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name <span className="text-[var(--primary)]">*</span></label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your full name" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[var(--primary)]" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address <span className="text-[var(--primary)]">*</span></label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@example.com" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[var(--primary)]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      placeholder="How can we help you?" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[var(--primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message <span className="text-[var(--primary)]">*</span></label>
                    <textarea 
                      rows={5} 
                      required 
                      placeholder="Tell us about your rental needs..." 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[var(--primary)] resize-none" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingContact}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5 text-sm disabled:opacity-60"
                  >
                    {isSubmittingContact ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
