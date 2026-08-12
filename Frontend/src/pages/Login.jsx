import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('Customer');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Mock Admin Login
    if (loginType === 'Admin' && email === 'avishkarshinde0507@gmail.com' && password === 'Avi_Shinde_0507') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userData', JSON.stringify({ name: 'Super Admin', email: 'avishkarshinde0507@gmail.com', role: 'admin' }));
      window.dispatchEvent(new Event('storage')); // Trigger update in Navbar
      toast.success('Admin Login Successful!');
      navigate('/admin');
      return;
    } else if (loginType === 'Admin') {
      toast.error('Invalid admin credentials');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', data.role || 'user');
        localStorage.setItem('userData', JSON.stringify(data));
        window.dispatchEvent(new Event('storage')); // Trigger update in Navbar
        toast.success('Login Successful!');
        
        // Route based on actual role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Connection error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
            <User className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="text-slate-500 mt-2">Login to manage your rentals and requests</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Login Type</label>
            <div className="relative">
              <select 
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
              <ShieldCheck className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email or Mobile</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter the Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
              />
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" variant="ghost" className="text-xs font-bold text-[var(--primary)] hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12"
              />
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group">
            Login as {loginType} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link 
            to="/" 
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all mt-3"
          >
            <Home className="w-4 h-4" /> Go to Home Page
          </Link>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500">
            Don't have an account? <Link to="/register" className="text-[var(--primary)] font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
