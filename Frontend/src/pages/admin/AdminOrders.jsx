import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Truck, CheckCircle2, Clock, MapPin, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../apiConfig';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders/all`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        localStorage.setItem('adminOrders', JSON.stringify(data));
      })
      .catch(err => {
        console.error('Fetch Orders Error:', err);
        const savedOrders = localStorage.getItem('adminOrders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      });
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    // orderId here should be the readable ID like #ORD-1234
    fetch(`${API_BASE_URL}/orders/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const updatedOrders = orders.map(order => 
          (order.orderId === orderId || order.id === orderId) ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
        toast.success(`Order ${orderId} marked as ${newStatus}`);
      }
    })
    .catch(err => toast.error('Failed to update status in database'));
  };

  const filteredOrders = orders.filter(o => 
    (o.orderId || o.id || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.product || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Order & Rental Management</h2>
          <p className="text-slate-500">Track shipments and update delivery statuses</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-12 focus:ring-2 focus:ring-slate-500/10"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Order Info</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Customer</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Delivery Address</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Schedule</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Payment</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Status</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-8 py-10 text-center text-slate-500">No orders found.</td>
              </tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.orderId || order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-900">{order.orderId || order.id}</p>
                  <p className="text-sm text-slate-600 truncate w-48" title={order.product}>{order.product}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Ordered: {order.date}</span>
                    {order.deliveryDate && <span className="text-[10px] bg-red-50 px-1.5 py-0.5 rounded text-red-600 font-bold">Deliver: {order.deliveryDate}</span>}
                    <span className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 font-bold">
                      Tenure: {order.extensionTenure ? (
                        `(${parseInt(order.extensionTenure)} + ${parseInt(order.tenure)}) Months`
                      ) : (
                        order.tenure || '6 Months'
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-900">{order.user}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm text-slate-600 leading-snug max-w-[200px]">{order.address || 'Viman Nagar, Pune, MH - 411001'}</p>
                  {order.location && (
                    <a 
                      href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}&z=20`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 font-bold"
                    >
                      <MapPin className="w-2.5 h-2.5 text-red-500" /> View GPS Location
                    </a>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" /> {order.deliveryDate || 'Not Scheduled'}
                    </span>
                    <span className="text-[10px] text-slate-400">10:00 AM - 06:00 PM</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-900">{order.amount}</p>
                  <p className="text-xs text-slate-500">{order.paymentMethod}</p>
                </td>
                <td className="px-8 py-5">
                  <span className={`flex items-center gap-1.5 text-xs font-bold w-fit px-3 py-1.5 rounded-full uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                     order.status === 'Pending' ? <Clock className="w-3.5 h-3.5" /> : 
                     <Truck className="w-3.5 h-3.5" />}
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderId || order.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 outline-none font-medium cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Active">Active</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
