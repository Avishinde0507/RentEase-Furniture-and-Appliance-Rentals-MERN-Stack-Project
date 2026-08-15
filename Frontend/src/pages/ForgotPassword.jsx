import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // step 1: enter email, step 2: verify OTP, step 3: reset password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Step 1: Send OTP to email ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setServerOtp(data.otp || '');
        if (data.smtpFallback) {
          setOtp(data.otp);
          toast.success(`Verification Code: ${data.otp}`, { duration: 6000 });
        } else {
          toast.success(data.message || 'Verification code sent to your email!');
        }
        setStep(2);
      } else {
        toast.error(data.message || 'Failed to send OTP.');
      }
    } catch {
      toast.error('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP.');
      return;
    }
    if (otp.trim() !== serverOtp.trim()) {
      toast.error('Invalid OTP. Please try again.');
      return;
    }
    setStep(3);
    toast.success('OTP verified!');
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch {
      toast.error('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/20">
            {step === 1 && <Mail className="text-white w-8 h-8" />}
            {step === 2 && <ShieldCheck className="text-white w-8 h-8" />}
            {step === 3 && <Lock className="text-white w-8 h-8" />}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 h-2.5 bg-[var(--primary)]'
                    : s < step
                    ? 'w-2.5 h-2.5 bg-emerald-500'
                    : 'w-2.5 h-2.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            {step === 1 && 'Enter your registered email to receive a verification code.'}
            {step === 2 && <>We sent a 6-digit code to <span className="font-bold text-slate-800">{email}</span></>}
            {step === 3 && 'Create a new strong password for your account.'}
          </p>
        </div>

        {/* Step Forms */}
        <AnimatePresence mode="wait">

          {/* ── Step 1: Email ── */}
          {step === 1 && (
            <motion.form
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-5"
              onSubmit={handleSendOTP}
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="input-field pl-12"
                  />
                  <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="text-center mt-2">
                <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </motion.form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 2 && (
            <motion.form
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
              onSubmit={handleVerifyOTP}
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center mb-3">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 text-center text-3xl tracking-[0.5em] font-bold focus:border-[var(--primary)] focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); }}
                className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Change Email
              </button>
            </motion.form>
          )}

          {/* ── Step 3: New Password ── */}
          {step === 3 && (
            <motion.form
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-5"
              onSubmit={handleResetPassword}
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    autoFocus
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                  />
                  <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                  />
                  <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 ml-1 font-medium">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || newPassword !== confirmPassword}
                className="w-full btn-primary !py-4 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
