import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Wishlist</h1>
            <p className="text-slate-500">You have {wishlist.length} items saved for later</p>
          </div>
          <Link to="/products" className="btn-outline !py-3 !px-6 flex items-center gap-2 font-bold">
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div 
                  key={product._id || product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-50">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button 
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-slate-700 font-bold text-xs">{product.rating}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rent starts</p>
                        <p className="text-xl font-bold text-slate-900">₹{product.rentPrice}<span className="text-xs text-slate-400">/mo</span></p>
                      </div>
                      <Link 
                        to={`/product/${product._id || product.id}`}
                        className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-[var(--primary)] transition-all shadow-lg shadow-slate-900/10"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-[var(--primary)] opacity-20" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Wishlist is Empty</h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">Looks like you haven't saved anything yet. Browse our collections and heart your favorites!</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-3 !px-10">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
