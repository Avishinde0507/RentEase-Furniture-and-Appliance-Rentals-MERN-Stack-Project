import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearWishlist } = useWishlist();
  const { clearCart } = useCart();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (response.ok) {
        setServerOtp(data.otp);
        setStep(2);
        toast.success('Verification code sent to your email!');
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      toast.error('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, otp, verifiedOtp: serverOtp })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account verified & created!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userData', JSON.stringify(data));
        
        clearWishlist();
        clearCart();

        // Update mock admin users list for management panel
        const existingUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
        const newUserForAdmin = {
          id: data._id || '#USR-' + Math.floor(1000 + Math.random() * 9000),
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          rentals: 0
        };
        localStorage.setItem('adminUsers', JSON.stringify([newUserForAdmin, ...existingUsers]));

        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="hidden md:block">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Join the <br /> <span className="text-[var(--primary)]">Rental Revolution</span></h2>
            <p className="text-slate-500 mb-10 leading-relaxed">Create an account to start renting premium furniture and appliances with zero commitment.</p>
            
            <div className="space-y-6">
              {[
                { icon: <ShieldCheck />, title: 'Secure Identity', desc: 'Your data is encrypted' },
                { icon: <Mail />, title: 'Email Verified', desc: 'Safe & secure registration' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-red-50 text-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0">
                    {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8 md:hidden text-center">
              <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            </div>

            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleSendOTP}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name" 
                      className="input-field pl-12" 
                    />
                    <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      className="input-field pl-12" 
                    />
                    <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mobile Number</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210" 
                      className="input-field pl-12" 
                    />
                    <Phone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className="input-field pl-12 pr-12" 
                    />
                    <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary !py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Sending Code...' : 'Create Account'}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6" 
                onSubmit={handleSubmit}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Verify Your Email</h3>
                  <p className="text-sm text-slate-500">We've sent a verification code to <br/> <span className="font-bold text-slate-900">{formData.email}</span></p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center block mb-4">Enter 6-Digit Code</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 text-center text-3xl tracking-[0.5em] font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  className="w-full btn-primary !bg-blue-600 !py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Verifying...' : 'Complete Registration'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Change Email Address
                </button>
              </motion.form>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-[var(--primary)] font-bold">Login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
