import React from 'react';
import { Star, ArrowRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist!');
      navigate('/login');
      return;
    }
    addToWishlist(product);
  };

  const handleViewProduct = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('Please login to view product details!');
      navigate('/login');
    }
  };

  return (
    <div className="card group">
      <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-slate-100">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            onError={(e) => {
              const appliancePlaceholder = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800';
              const furniturePlaceholder = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800';
              e.target.src = product.category === 'Appliances' ? appliancePlaceholder : furniturePlaceholder;
            }}
          />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
          {product.category}
        </div>
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isInWishlist(product._id || product.id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-sm'}`}
        >
          <Heart className={`w-5 h-5 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-slate-700 font-semibold text-sm">{product.rating}</span>
        </div>
      </div>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Starts from</p>
          <p className="text-xl font-bold text-slate-900">₹{product.rentPrice}/mo</p>
        </div>
        <Link 
          to={`/product/${product._id || product.id}`} 
          onClick={handleViewProduct}
          className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-[var(--primary)] transition-all"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

