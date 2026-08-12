import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';

const AdminAnalytics = () => {
  const [orderData, setOrderData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [kpis, setKpis] = useState({ revenue: 0, orders: 0, users: 0 });

  useEffect(() => {
    // 1. Fetch Orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders')) || [
      { id: '#ORD-9921', user: 'Rahul Sharma', product: 'Cloud Sofa', amount: '₹899', status: 'Delivered', date: '22 Apr', paymentMethod: 'Online Payment' },
      { id: '#ORD-9920', user: 'Anjali Gupta', product: 'Smart TV', amount: '₹1299', status: 'Pending', date: '23 Apr', paymentMethod: 'Cash on Delivery' },
      { id: '#ORD-9919', user: 'Vikram Singh', product: 'Washing Machine', amount: '₹949', status: 'Dispatched', date: '24 Apr', paymentMethod: 'Online Payment' },
      { id: '#ORD-9918', user: 'Priya Verma', product: 'Fridge', amount: '₹1599', status: 'Delivered', date: '25 Apr', paymentMethod: 'Cash on Delivery' },
    ];

    // Process Orders for Revenue Chart (Group by Date)
    const revenueByDate = {};
    let totalRevenue = 0;
    let onlineCount = 0;
    let codCount = 0;

    savedOrders.forEach(order => {
      const date = order.date;
      const amount = parseInt(order.amount.replace(/[^0-9]/g, ''), 10) || 0;
      
      totalRevenue += amount;
      
      if (revenueByDate[date]) {
        revenueByDate[date] += amount;
      } else {
        revenueByDate[date] = amount;
      }

      if (order.paymentMethod === 'Online Payment') onlineCount++;
      else codCount++;
    });

    // Convert to array and sort (mock sorting by just letting it be, or assume it's roughly chronological)
    const formattedOrderData = Object.keys(revenueByDate).map(date => ({
      date,
      revenue: revenueByDate[date]
    })).reverse(); // Reverse to show oldest to newest if they were unshifted

    setOrderData(formattedOrderData);
    setPaymentData([
      { name: 'Online Payment', value: onlineCount, color: '#3b82f6' }, // blue-500
      { name: 'Cash on Delivery', value: codCount, color: '#ef4444' } // red-500
    ]);

    // 2. Fetch Users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('adminUsers')) || [
      { joined: '22 Apr' }, { joined: '22 Apr' }, { joined: '23 Apr' },
      { joined: '24 Apr' }, { joined: '24 Apr' }, { joined: '25 Apr' },
    ];

    // Process Users for Registration/Login Chart (Group by joined date)
    const usersByDate = {};
    savedUsers.forEach(user => {
      // Mocking logins using joined date for simplicity
      const date = user.joined;
      if (usersByDate[date]) {
        usersByDate[date] += 1;
      } else {
        usersByDate[date] = 1;
      }
    });

    const formattedUserData = Object.keys(usersByDate).map(date => ({
      date,
      logins: usersByDate[date]
    })).reverse();

    setUserData(formattedUserData);

    // Set KPIs
    setKpis({
      revenue: totalRevenue,
      orders: savedOrders.length,
      users: savedUsers.length
    });

  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-300">{entry.name}:</span> 
              <span className="font-bold">{entry.name === 'revenue' ? `₹${entry.value}` : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="text-slate-500">Real-time insights based on customer orders and activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">₹{kpis.revenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Orders</p>
            <p className="text-3xl font-bold text-slate-900">{kpis.orders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Customer Accounts</p>
            <p className="text-3xl font-bold text-slate-900">{kpis.users}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Analytics</h3>
              <p className="text-sm text-slate-500">Daily earnings and targets</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live Updates
              </span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderData.length > 1 ? orderData : [
                { date: '19 Apr', revenue: 4200, target: 5000 },
                { date: '20 Apr', revenue: 5100, target: 5000 },
                { date: '21 Apr', revenue: 4800, target: 5500 },
                { date: '22 Apr', revenue: 6200, target: 5500 },
                { date: '23 Apr', revenue: 5800, target: 6000 },
                { date: '24 Apr', revenue: 7500, target: 6000 },
                { date: '25 Apr', revenue: kpis.revenue || 8200, target: 7000 },
              ]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  tickFormatter={(value) => `₹${value/1000}k`} 
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fill="url(#colorTarget)" 
                  fillOpacity={1}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981 shadow-xl' }}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-slate-600">Actual Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <span className="text-sm font-bold text-slate-400">Daily Target</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Payment Mix</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  formatter={(value) => <span className="text-slate-600 font-bold text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-center pointer-events-none">
            <p className="text-2xl font-bold text-slate-900">{kpis.orders}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
          </div>
        </div>

        {/* Customer Logins Bar Chart */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Engagement</h3>
              <p className="text-sm text-slate-500">Daily logins and registrations</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 10 }} />
                <Bar 
                  dataKey="logins" 
                  name="Active Customers" 
                  fill="url(#colorBar)" 
                  radius={[10, 10, 10, 10]} 
                  maxBarSize={40}
                >
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === userData.length - 1 ? '#4f46e5' : 'url(#colorBar)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
