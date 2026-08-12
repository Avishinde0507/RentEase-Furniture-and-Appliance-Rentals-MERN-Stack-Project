import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, User, Quote } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const initialReviews = [
    { id: 1, name: 'Anurag', rating: 5, text: 'The ownership transfer process at RentEase was smooth, well structured, and efficient. Clear documentation, timely knowledge transfer sessions, and proactive support from both teams ensured a seamless handover with zero disruption.', date: '20 Apr 2024' },
    { id: 2, name: 'Deshpande Onkar S...', rating: 5, text: 'Impressed with RentEase\'s next-day delivery! The process was smooth and super quick. Got my furniture delivered the very next day as promised. Efficient, reliable, and perfect for urgent needs!', date: '22 Apr 2024' },
    { id: 3, name: 'Shubham Katiyar', rating: 5, text: 'I\'ve had a great experience with RentEase and would definitely recommend their services to anyone looking to rent furniture or appliances. From placing the order to delivery and installation, everything was seamless and professional.', date: '23 Apr 2024' },
    { id: 4, name: 'Ayushee Manhas', rating: 5, text: 'Best', date: '24 Apr 2024' },
    { id: 5, name: 'Ilavarasan A', rating: 5, text: 'Excellent service\'s', date: '25 Apr 2024' }
  ];

  useEffect(() => {
    const savedReviews = localStorage.getItem('rentease_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(initialReviews);
      localStorage.setItem('rentease_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  const deleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updatedReviews = reviews.filter(r => r.id !== id);
      setReviews(updatedReviews);
      localStorage.setItem('rentease_reviews', JSON.stringify(updatedReviews));
      toast.success('Review deleted successfully');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
        <p className="text-slate-500">Manage and moderate customer testimonials</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by customer or review text..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-12 focus:ring-2 focus:ring-slate-500/10 outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 group">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="text-slate-400 w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <Quote className="w-5 h-5 text-slate-200 flex-shrink-0" />
                  <p className="text-slate-600 leading-relaxed italic">{review.text}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <button 
                onClick={() => deleteReview(review.id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Review"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Quote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No reviews found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
