import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Lock, Eye, EyeOff, Save, X, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editedData, setEditedData] = useState({ name: '', mobile: '', address: '' });

  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    let emailToFetch = '';

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      emailToFetch = parsed.email;
      setEditedData({
        name: parsed.name || '',
        mobile: parsed.mobile || '',
        address: typeof parsed.address === 'string' ? parsed.address : (parsed.address?.street || '')
      });
    }

    if (emailToFetch) {
      fetch(`${API_BASE_URL}/auth/user/${encodeURIComponent(emailToFetch)}`)
        .then(res => res.ok ? res.json() : null)
        .then(dbUser => {
          if (!dbUser) return;
          setUserData(dbUser);
          localStorage.setItem('userData', JSON.stringify(dbUser));
          setEditedData({
            name: dbUser.name || '',
            mobile: dbUser.mobile || '',
            address: typeof dbUser.address === 'string' ? dbUser.address : (dbUser.address?.street || '')
          });
        })
        .catch(() => {});
    }
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const updatedUser = { ...userData, ...editedData };
    setUserData(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
    setIsEditing(false);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: updatedUser.email, name: updatedUser.name, mobile: updatedUser.mobile, address: updatedUser.address })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUserData(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        window.dispatchEvent(new Event('storage'));
        toast.success('Profile updated in Database!');
      } else {
        toast.success('Profile updated!');
      }
    } catch {
      toast.success('Profile saved locally!');
    }
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPwd(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch {
      toast.error('Server error. Please try again.');
    }
    setIsChangingPwd(false);
  };

  const displayName = userData?.name || 'User';
  const displayEmail = userData?.email || '';
  const displayMobile = userData?.mobile
    ? (userData.mobile.startsWith('+') ? userData.mobile : `+91 ${userData.mobile}`)
    : 'Not set';
  const displayAddress = editedData.address || 'No address saved';
  const memberSince = userData?.createdAt && !isNaN(new Date(userData.createdAt).getTime())
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Card */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 mb-6">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-700 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #ef4444 0%, transparent 60%)' }} />
            <div className="absolute -bottom-14 left-10">
              <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-xl">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ef4444&color=fff&size=200`}
                  className="w-full h-full rounded-xl object-cover"
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
          <div className="pt-16 px-10 pb-6">
            <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
            <p className="text-slate-400 text-sm mt-1">RentEase Member since {memberSince}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-8 border-b border-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
                <p className="text-slate-400 text-sm mt-1">Update your personal details and delivery address</p>
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 btn-primary !py-2.5 !px-6 shadow-lg shadow-red-500/20 text-sm">
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 space-y-5 max-w-2xl">
              {/* Full Name */}
              <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200 ring-4 ring-red-500/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isEditing ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={e => setEditedData({ ...editedData, name: e.target.value })}
                      className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
                      placeholder="Enter full name"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{displayName}</p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address</p>
                  <p className="font-bold text-slate-900">{displayEmail}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Email cannot be changed</p>
                </div>
              </div>

              {/* Mobile Number */}
              <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200 ring-4 ring-red-500/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isEditing ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Mobile Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.mobile}
                      onChange={e => setEditedData({ ...editedData, mobile: e.target.value })}
                      className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
                      placeholder="9876543210"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{displayMobile}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200 ring-4 ring-red-500/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isEditing ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Delivery Address</p>
                  {isEditing ? (
                    <textarea
                      value={editedData.address}
                      onChange={e => setEditedData({ ...editedData, address: e.target.value })}
                      className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm leading-relaxed resize-none"
                      rows="3"
                      placeholder="Enter your full delivery address..."
                    />
                  ) : (
                    <p className="font-bold text-slate-900 leading-relaxed">{displayAddress}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
              <p className="text-slate-400 text-sm mt-1">Ensure your account is using a strong password for security</p>
            </div>

            <div className="p-8 space-y-5 max-w-2xl">
              {/* Old Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Old Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-300 focus:ring-4 focus:ring-red-500/5 font-bold text-slate-900 outline-none transition-all"
                    placeholder="Enter your current password"
                  />
                  <button onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">New Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-300 focus:ring-4 focus:ring-red-500/5 font-bold text-slate-900 outline-none transition-all"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        passwordData.newPassword.length >= i * 3
                          ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-blue-400' : 'bg-emerald-400'
                          : 'bg-slate-200'
                      }`} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">
                      {passwordData.newPassword.length < 4 ? 'Weak' : passwordData.newPassword.length < 8 ? 'Fair' : passwordData.newPassword.length < 12 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-12 py-4 rounded-2xl border focus:ring-4 focus:ring-red-500/5 font-bold text-slate-900 outline-none transition-all ${
                      passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                        ? 'bg-red-50 border-red-300'
                        : passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 focus:border-red-300'
                    }`}
                    placeholder="Re-enter new password"
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500 font-bold mt-1.5">Passwords do not match</p>
                )}
                {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                  <p className="text-xs text-emerald-500 font-bold mt-1.5">✓ Passwords match</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPwd}
                  className="btn-primary !py-4 !px-8 flex items-center gap-2 shadow-lg shadow-red-500/20"
                >
                  <Shield className="w-4 h-4" />
                  {isChangingPwd ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
