import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../apiConfig';

const AdminExtendRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/extend/all`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Fetch Extensions Error:', err));
  }, []);

  const handleStatusUpdate = (requestId, status) => {
    fetch(`${API_BASE_URL}/extend/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setRequests(requests.map(req => req._id === requestId ? { ...req, status } : req));
        toast.success(`Request ${status} successfully!`);
      }
    })
    .catch(err => toast.error('Failed to update status'));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Rental Extensions</h2>
          <p className="text-slate-500">Approve or reject customer requests to extend their rental tenure.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          Total Requests: {requests.length}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm">Order Info</th>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm">Customer</th>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm">Payment Info</th>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm">Tenure Change</th>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm">Status</th>
              <th className="px-8 py-6 font-bold text-slate-900 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold text-lg">No extension requests yet.</p>
                  </div>
                </td>
              </tr>
            ) : requests.map((req) => (
              <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900 mb-1">{req.orderId}</p>
                  <p className="text-sm text-slate-500 truncate w-48 font-medium" title={req.product}>{req.product}</p>
                </td>
                <td className="px-8 py-6 font-bold text-slate-700">{req.user}</td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-emerald-600 text-sm">₹{req.amount || 0}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase ${req.paymentId === 'COD' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {req.paymentId === 'COD' ? 'Pay on Delivery' : 'Paid Online'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{req.paymentId || 'N/A'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 line-through text-xs font-bold">{req.currentTenure}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg text-sm">{req.requestedTenure}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold w-fit px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                     req.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                     <Clock className="w-3.5 h-3.5" />}
                    {req.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {req.status === 'Pending' ? (
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Approved')}
                        className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                        className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExtendRequests;
