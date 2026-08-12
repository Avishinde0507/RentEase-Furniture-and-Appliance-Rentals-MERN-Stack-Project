import React, { useState, useEffect } from 'react';
import { Settings, Wrench, MessageSquare, Calendar, Image as ImageIcon, Send, Clock, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [user, setUser] = useState(null);
  const [myRentedProducts, setMyRentedProducts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [reviewData, setReviewData] = useState({ rating: 5, text: '' });
  
  const [formData, setFormData] = useState({
    product: '',
    issueType: 'General Repair',
    date: '',
    description: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setUser(userData);
      
      // Get rented products
      const allOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const userOrders = allOrders.filter(order => order.user === userData.name);
      const products = userOrders.map(o => o.product);
      setMyRentedProducts(products);
      if (products.length > 0) {
        setFormData(prev => ({ ...prev, product: products[0] }));
      }

      // Get my requests
      const allRequests = JSON.parse(localStorage.getItem('rentease_maintenance')) || [];
      setMyRequests(allRequests.filter(req => req.userId === userData.email || req.userName === userData.name));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a request');
      return;
    }

    const newRequest = {
      id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
      userId: user.email,
      userName: user.name,
      product: formData.product,
      issue: formData.description,
      type: formData.issueType,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      visitDate: formData.date
    };

    // Save to MongoDB
    fetch(`${API_BASE_URL}/maintenance/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    })
    .then(res => res.json())
    .then(data => console.log('✅ Maintenance request saved to MongoDB:', data))
    .catch(err => console.error('❌ MongoDB Maintenance Error:', err));

    const allRequests = JSON.parse(localStorage.getItem('rentease_maintenance')) || [];
    const updatedRequests = [newRequest, ...allRequests];
    localStorage.setItem('rentease_maintenance', JSON.stringify(updatedRequests));
    
    setMyRequests(prev => [newRequest, ...prev]);
    toast.success('Maintenance request submitted successfully!');
    setActiveTab('status');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to give a review');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: user.name,
      rating: reviewData.rating,
      text: reviewData.text,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const savedReviews = JSON.parse(localStorage.getItem('rentease_reviews')) || [];
    localStorage.setItem('rentease_reviews', JSON.stringify([newReview, ...savedReviews]));
    
    // Trigger event for home page to update if needed (not needed since home fetches on mount, but good for local)
    window.dispatchEvent(new Event('storage'));

    toast.success('Thank you for your valuable feedback!');
    setReviewData({ rating: 5, text: '' });
    setActiveTab('status');
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Support & Maintenance</h1>
          <p className="text-slate-500">Is something not working? Our technicians are ready to help.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'new' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              New Request
            </button>
            <button 
              onClick={() => setActiveTab('status')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'status' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Track Requests
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'review' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Rate Our Service
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Form code... */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Select Rented Product</label>
                    <select 
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      className="input-field appearance-none bg-slate-50 border-none"
                    >
                      {myRentedProducts.length > 0 ? (
                        myRentedProducts.map((p, i) => <option key={i}>{p}</option>)
                      ) : (
                        <option>No products rented yet</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Issue Type</label>
                    <select 
                      value={formData.issueType}
                      onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                      className="input-field appearance-none bg-slate-50 border-none"
                    >
                      <option>General Repair</option>
                      <option>Deep Cleaning</option>
                      <option>Product Replacement</option>
                      <option>Relocation Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Preferred Visit Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="input-field" 
                      />
                      <Calendar className="absolute right-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Describe the Issue</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Please tell us what's wrong..." 
                      rows="4" 
                      className="input-field resize-none py-4"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Upload Photo (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[var(--primary)] transition-all cursor-pointer bg-slate-50 group">
                      <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2 group-hover:text-[var(--primary)]" />
                      <p className="text-sm text-slate-500 font-medium">Click to upload or drag & drop</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full btn-primary !py-5 flex items-center justify-center gap-3">
                    <Send className="w-5 h-5" /> Submit Maintenance Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : activeTab === 'review' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">How was your experience?</h2>
                <p className="text-slate-500 mb-8">Your feedback helps us improve and serves as inspiration for others.</p>
                
                <form onSubmit={handleReviewSubmit} className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          className={`w-12 h-12 ${star <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-slate-700 ml-1">Write your review</label>
                    <textarea 
                      required
                      value={reviewData.text}
                      onChange={(e) => setReviewData({...reviewData, text: e.target.value})}
                      placeholder="Share your experience with RentEase products and services..." 
                      rows="5" 
                      className="input-field resize-none py-4"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full btn-primary !py-5 flex items-center justify-center gap-3">
                    <Send className="w-5 h-5" /> Post My Review
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {myRequests.length > 0 ? myRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${req.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {req.status === 'Completed' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{req.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{req.product}</h3>
                    </div>
                  </div>
                  
                  <div className="flex-grow md:text-center">
                    <p className="text-sm font-bold text-slate-700">{req.type}</p>
                    <p className="text-sm text-slate-500">{req.issue}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Requested On</p>
                    <p className="font-bold text-slate-900">{req.date}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No maintenance requests found.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
