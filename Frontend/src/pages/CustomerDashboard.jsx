import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Wrench, Heart, LogOut,
  ArrowRight, Package, Star,
  ChevronRight, LayoutDashboard, UserCircle, Search, Home
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

// Import child views to render directly within Customer Dashboard
import ProductListing from './ProductListing';
import MyRentals from './MyRentals';
import Maintenance from './Maintenance';
import Wishlist from './Wishlist';
import Profile from './Profile';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [rentals, setRentals] = useState([]);
  const [pendingServiceCount, setPendingServiceCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const saved = localStorage.getItem('userData');

    if (!isLoggedIn || !saved) {
      navigate('/login');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(saved);
    } catch {
      navigate('/login');
      return;
    }

    if (parsed.role === 'admin') {
      navigate('/admin');
      return;
    }

    setUserData(parsed);
    setReady(true);

    // Fetch user orders for overview stats
    fetch(`${API_BASE_URL}/orders/all`)
      .then(res => res.json())
      .then(allOrders => {
        const myOrders = allOrders.filter(
          o => o.user === parsed.name || o.email === parsed.email
        );
        setRentals(myOrders);
      })
      .catch(() => {});

    // Fetch maintenance requests for pending count
    fetch(`${API_BASE_URL}/maintenance/all`)
      .then(res => res.json())
      .then(allMaintenance => {
        const myMaint = allMaintenance.filter(
          m => m.userId === parsed.email || m.userName === parsed.name
        );
        const pending = myMaint.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
        setPendingServiceCount(pending);
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.dispatchEvent(new Event('storage'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!ready || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = userData.name || 'Customer';
  const displayEmail = userData.email || '';
  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const sidebarItems = [
    { id: 'overview',    label: 'Dashboard',       icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'browse',      label: 'Browse Products',  icon: <Package className="w-5 h-5" /> },
    { id: 'rentals',     label: 'My Rentals',       icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'maintenance', label: 'Maintenance',      icon: <Wrench className="w-5 h-5" /> },
    { id: 'wishlist',    label: 'Wishlist',         icon: <Heart className="w-5 h-5" /> },
    { id: 'profile',     label: 'Manage Profile',   icon: <UserCircle className="w-5 h-5" /> },
    { id: 'home',        label: 'Home',             icon: <Home className="w-5 h-5" />, isNav: true, navPath: '/' },
  ];

  const activeRentalsCount = rentals.filter(r => r.status !== 'Cancelled').length;

  const stats = [
    { id: 'rentals',     label: 'Active Rentals',  value: activeRentalsCount,            icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-blue-500',    trend: '+5.2%',  up: true },
    { id: 'rentals',     label: 'Total Orders',    value: rentals.length,                icon: <Package className="w-6 h-6" />,     color: 'bg-emerald-500', trend: '+12%',   up: true },
    { id: 'profile',     label: 'Loyalty Points',  value: userData.loyaltyPoints || 0,   icon: <Star className="w-6 h-6" />,        color: 'bg-amber-500',   trend: '+8.1%',  up: true },
    { id: 'maintenance', label: 'Pending Service', value: pendingServiceCount,           icon: <Wrench className="w-6 h-6" />,      color: 'bg-rose-500',    trend: '—',      up: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Left Sidebar ── */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed top-0 bottom-0 left-0 z-30 hidden lg:flex overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Rent<span className="text-red-500">Ease</span>
          </span>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ef4444&color=fff&size=200`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
            ✓ Verified Customer
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.isNav ? navigate(item.navPath) : setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                !item.isNav && activeTab === item.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${!item.isNav && activeTab === item.id ? 'opacity-100 translate-x-0.5' : 'opacity-30'}`} />
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 lg:ml-72 min-h-screen">

        {/* Top Header for Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, {displayName}! Member since {memberSince}.</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white border border-slate-200 rounded-full py-2 px-10 focus:ring-2 focus:ring-slate-500/10 w-48 text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-400">Customer</p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ef4444&color=fff&size=200`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Overview Tab Content ── */}
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Stats Grid (4 Analysis Points) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setActiveTab(stat.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg group-hover:scale-105 transition-transform`}>
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Rentals & Summary */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Rentals Table */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center p-7 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Recent Rental Orders</h3>
                    <button
                      onClick={() => setActiveTab('rentals')}
                      className="text-sm font-bold text-red-500 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {rentals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-700 mb-2">No rentals yet</p>
                      <p className="text-slate-400 text-sm mb-5">Browse products and place your first rental!</p>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="btn-primary !py-2.5 !px-6 flex items-center gap-2 text-sm"
                      >
                        Browse Products <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <tr>
                            <th className="pb-4 px-7 pt-4">Product</th>
                            <th className="pb-4 px-4 pt-4">Amount</th>
                            <th className="pb-4 px-4 pt-4">Date</th>
                            <th className="pb-4 px-7 pt-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {rentals.slice(0, 5).map((order, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-7">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Package className="w-5 h-5 text-slate-400" />
                                  </div>
                                  <p className="font-bold text-slate-900 text-sm">{order.product || 'Rental Product'}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-slate-900 text-sm">{order.amount || '—'}</td>
                              <td className="py-4 px-4 text-slate-500 text-sm">{order.date || 'N/A'}</td>
                              <td className="py-4 px-7">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  order.status === 'Delivered' || order.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : order.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>{order.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Rental Summary Panel */}
                <div className="bg-slate-900 rounded-3xl p-7 text-white relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-6">Rental Summary</h3>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-slate-400 text-sm mb-2 flex justify-between">
                          Active <span className="text-white font-bold">{activeRentalsCount}</span>
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: rentals.length > 0 ? `${(activeRentalsCount / rentals.length) * 100}%` : '0%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2 flex justify-between">
                          Delivered <span className="text-white font-bold">{rentals.filter(r => r.status === 'Delivered').length}</span>
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: rentals.length > 0 ? `${(rentals.filter(r => r.status === 'Delivered').length / rentals.length) * 100}%` : '0%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2 flex justify-between">
                          Pending <span className="text-white font-bold">{rentals.filter(r => r.status === 'Pending').length}</span>
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: rentals.length > 0 ? `${(rentals.filter(r => r.status === 'Pending').length / rentals.length) * 100}%` : '0%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center pt-6 border-t border-white/10">
                    <p className="text-3xl font-bold mb-1">{userData.loyaltyPoints || 0}</p>
                    <p className="text-sm text-slate-400">Loyalty Points Earned</p>
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Sub-views for Sidebar Items ── */}
        {activeTab === 'browse' && (
          <div className="-mt-24">
            <ProductListing />
          </div>
        )}

        {activeTab === 'rentals' && (
          <div className="-mt-24">
            <MyRentals />
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="-mt-24">
            <Maintenance />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="-mt-24">
            <Wishlist />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="-mt-24">
            <Profile />
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;
