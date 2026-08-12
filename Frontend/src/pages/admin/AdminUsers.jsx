import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Shield, Trash2, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Mock fallback
      setUsers([
        { id: 'USR-101', name: 'Rahul Sharma', email: 'rahul@example.com', mobile: '9876543210', rentals: 3, joined: '10 Jan 2026' },
        { id: 'USR-102', name: 'Anjali Gupta', email: 'anjali@example.com', mobile: '8765432109', rentals: 0, joined: '15 Feb 2026' },
      ]);
    }
  }, []);

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    toast.success('User deleted successfully');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">View and manage customer accounts</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-12 focus:ring-2 focus:ring-slate-500/10"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Customer</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Contact Info</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Total Rentals</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-10 text-center text-slate-500">No users found.</td>
              </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">Joined {user.joined}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                  <p className="text-xs text-slate-500">+91 {user.mobile}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{user.rentals} Orders</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors tooltip" title="View Rental History">
                      <History className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
