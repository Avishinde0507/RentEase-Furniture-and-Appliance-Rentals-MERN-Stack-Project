import React, { useState, useEffect } from 'react';
import { Wrench, Clock, CheckCircle2, AlertCircle, User, MessageSquare, Search, Filter, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../apiConfig';

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/maintenance/all`)
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        localStorage.setItem('rentease_maintenance', JSON.stringify(data));
      })
      .catch(err => {
        console.error('Fetch Maintenance Error:', err);
        const saved = localStorage.getItem('rentease_maintenance');
        if (saved) setRequests(JSON.parse(saved));
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    fetch(`${API_BASE_URL}/maintenance/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: id, status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const updatedRequests = requests.map(req => 
          (req.requestId === id || req._id === id || req.id === id) ? { ...req, status: newStatus } : req
        );
        setRequests(updatedRequests);
        localStorage.setItem('rentease_maintenance', JSON.stringify(updatedRequests));
        toast.success(`Request marked as ${newStatus}`);
      }
    })
    .catch(err => toast.error('Failed to update status in database'));
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = (req.product || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (req.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (req.requestId || req.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Maintenance Requests</h2>
          <p className="text-slate-500 text-sm">Manage and track all service & repair tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by ID, User or Product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-12 focus:ring-2 focus:ring-slate-500/10"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl px-6 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-500/10"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Request ID</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Customer</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Product & Issue</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Preferred Visit</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Status</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRequests.map((req) => (
              <tr key={req.requestId || req.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{req.requestId || req.id}</span>
                  <span className="text-sm font-bold text-slate-900">{req.date}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                      {req.userName ? req.userName.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{req.userName}</p>
                      <p className="text-xs text-slate-500">{req.userId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900 text-sm">{req.product}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" /> {req.issue}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-red-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      {req.visitDate ? new Date(req.visitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Asap'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Preferred Slot: 10AM - 5PM</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    req.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {req.status === 'Pending' && (
                      <button 
                        onClick={() => handleStatusChange(req._id || req.requestId || req.id, 'In Progress')}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Mark as In Progress"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}
                    {req.status !== 'Completed' && (
                      <button 
                        onClick={() => handleStatusChange(req._id || req.requestId || req.id, 'Completed')}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Mark as Completed"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div className="p-20 text-center">
            <Wrench className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No maintenance requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaintenance;
