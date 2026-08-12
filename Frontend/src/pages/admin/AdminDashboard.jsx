import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import { 
  LayoutDashboard, Package, Users, ShoppingBag, 
  LogOut, Search, TrendingUp, TrendingDown, DollarSign, Activity, Wrench,
  BarChart3, Star, Calendar, UserCircle, Home, Menu, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminInventory from './AdminInventory';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminAnalytics from './AdminAnalytics';
import AdminMaintenance from './AdminMaintenance';
import AdminReviews from './AdminReviews';
import AdminExtendRequests from './AdminExtendRequests';
import Profile from '../Profile';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const saved = localStorage.getItem('userData');
  const adminUserData = saved ? JSON.parse(saved) : {
    name: 'Super Admin',
    email: 'avishkarshinde0507@gmail.com',
    role: 'admin'
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/orders/all`)
      .then(res => res.json())
      .then(orders => {
        const totalRevenue = orders.reduce((sum, order) => sum + (parseInt(order.amount?.replace(/[^0-9]/g, ''), 10) || 0), 0);
        const activeRentals = orders.filter(o => o.status !== 'Cancelled').length;
        
        // Total Users
        const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
        
        // Pending Service
        fetch(`${API_BASE_URL}/maintenance/all`)
          .then(res => res.json())
          .then(maintenance => {
            const pendingService = maintenance.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
            
            setStats([
              { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'bg-emerald-500', trend: '+12.5%', isUp: true },
              { title: 'Active Rentals', value: activeRentals.toLocaleString(), icon: <Activity />, color: 'bg-blue-500', trend: '+5.2%', isUp: true },
              { title: 'Total Users', value: users.length.toLocaleString(), icon: <Users />, color: 'bg-violet-500', trend: '+18.1%', isUp: true },
              { title: 'Pending Service', value: pendingService.toString(), icon: <Wrench />, color: 'bg-amber-500', trend: '-2.4%', isUp: false },
            ]);
          })
          .catch(() => {});

        setRecentOrders(orders.slice(0, 5));
        localStorage.setItem('adminOrders', JSON.stringify(orders));
      })
      .catch(err => console.error('Dashboard Sync Error:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.dispatchEvent(new Event('storage'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory Management', icon: <Package className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
    { id: 'orders', label: 'Order & Rental', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'analytics', label: 'Reports & Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-5 h-5" /> },
    { id: 'extend', label: 'Extend Requests', icon: <Calendar className="w-5 h-5" /> },
    { id: 'reviews', label: 'Customer Reviews', icon: <Star className="w-5 h-5" /> },
    { id: 'profile', label: 'Manage Profile', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, isLink: true },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Mobile Overlay ── */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Admin Sidebar ── */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${ sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0' }
        `}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Rent<span className="text-red-500">Ease</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Admin
            </span>
            {/* Close button visible on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminUserData.name)}&background=1e293b&color=fff&size=200`}
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">{adminUserData.name}</p>
              <p className="text-xs text-slate-400 truncate">{adminUserData.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, idx) => (
            <button 
              key={item.id}
              onClick={() => {
                if (item.isLink) {
                  navigate('/');
                } else {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }
              }}
              style={{ transitionDelay: sidebarOpen ? `${idx * 30}ms` : '0ms' }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all text-left text-sm ${
                activeTab === item.id && !item.isLink
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : item.isLink
                  ? 'text-[var(--primary)] hover:bg-red-50 hover:text-red-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 min-h-screen">

        {/* Mobile top bar with hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center shadow shadow-red-500/30">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-base font-bold text-slate-900">Rent<span className="text-red-500">Ease</span></span>
          </div>
          <span className="ml-auto px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Admin</span>
        </div>

        {activeTab === 'profile' ? (
          <div className="-mt-24">
            <Profile />
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                  <input type="text" placeholder="Search report..." className="bg-white border border-slate-200 rounded-full py-2 px-10 focus:ring-2 focus:ring-slate-500/10 w-64 text-sm" />
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                </div>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900">{adminUserData.name}</p>
                    <p className="text-xs text-slate-500">Super Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-900 overflow-hidden border border-slate-200">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminUserData.name)}&background=1e293b&color=fff`} alt="Admin" />
                  </div>
                </div>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg`}>
                      {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {stat.trend}
                    </div>
                  </div>
                  <h4 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h4>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Recent Rental Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-red-500 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <tr>
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Delivery</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-900 text-sm">{order.id}</td>
                          <td className="py-4 text-slate-600 text-sm">{order.user}</td>
                          <td className="py-4 text-slate-600 text-sm">{order.product}</td>
                          <td className="py-4 font-bold text-slate-900 text-sm">{order.amount}</td>
                          <td className="py-4 font-bold text-red-600 text-sm">{order.deliveryDate || 'N/A'}</td>
                          <td className="py-4">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-8">Revenue Analytics</h3>
                  <div className="space-y-8 relative z-10">
                    <div>
                      <p className="text-slate-400 text-sm mb-4 flex justify-between">
                        Furniture <span>72%</span>
                      </p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[72%]"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-4 flex justify-between">
                        Appliances <span>28%</span>
                      </p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[28%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center pt-6 border-t border-white/10">
                  <p className="text-3xl font-bold mb-2">₹1,45,200</p>
                  <p className="text-sm text-slate-400 font-medium">Growth this month</p>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {activeTab === 'inventory' ? (
              <AdminInventory />
            ) : activeTab === 'users' ? (
              <AdminUsers />
            ) : activeTab === 'orders' ? (
              <AdminOrders />
            ) : activeTab === 'analytics' ? (
              <AdminAnalytics />
            ) : activeTab === 'maintenance' ? (
              <AdminMaintenance />
            ) : activeTab === 'reviews' ? (
              <AdminReviews />
            ) : activeTab === 'extend' ? (
              <AdminExtendRequests />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <Package className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-500 font-bold text-xl">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
