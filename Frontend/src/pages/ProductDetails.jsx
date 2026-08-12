import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RotateCcw, Info, ShoppingCart, Heart, Share2, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { products } = useProducts();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedTenure, setSelectedTenure] = useState(6);
  const [activeImg, setActiveImg] = useState(0);

  // Find product by id
  const product = products.find(p => (p._id || p.id).toString() === id.toString());

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      toast.error('Please login to continue!');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireLogin()) return;
    const rent = calculateRent(selectedTenure);
    addToCart(product, selectedTenure, rent);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!requireLogin()) return;
    const rent = calculateRent(selectedTenure);
    addToCart(product, selectedTenure, rent);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!requireLogin()) return;
    addToWishlist(product);
  };

  const tenureOptions = [
    { months: 3, discount: 0 },
    { months: 6, discount: 10 },
    { months: 12, discount: 20 },
  ];

  const calculateRent = (months) => {
    const discount = tenureOptions.find(o => o.months === months)?.discount || 0;
    return Math.round(product.rentPrice * (1 - discount / 100));
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-[var(--primary)]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[var(--primary)]">Furniture</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100"
            >
              <img 
                src={product.images[activeImg]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const appliancePlaceholder = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800';
                  const furniturePlaceholder = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800';
                  e.target.src = product.category === 'Appliances' ? appliancePlaceholder : furniturePlaceholder;
                }}
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[var(--primary)] scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-50 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.brand}</span>
                <div className="flex items-center gap-1 text-amber-400 ml-auto">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-900 font-bold">{product.rating}</span>
                  <span className="text-slate-400 text-sm font-medium">({product.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tenure Selection */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--primary)]" /> Choose Tenure
              </h4>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {tenureOptions.map((opt) => (
                  <button 
                    key={opt.months}
                    onClick={() => setSelectedTenure(opt.months)}
                    className={`relative p-4 rounded-2xl border-2 transition-all ${selectedTenure === opt.months ? 'border-[var(--primary)] bg-white shadow-md' : 'border-slate-200 bg-transparent hover:border-slate-300'}`}
                  >
                    {opt.discount > 0 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {opt.discount}% OFF
                      </span>
                    )}
                    <p className="text-lg font-bold text-slate-900">{opt.months} Mo</p>
                    <p className="text-xs text-slate-500">₹{calculateRent(opt.months)}/mo</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Monthly Rent</span>
                  <span className="text-2xl font-bold text-slate-900">₹{calculateRent(selectedTenure)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2">
                    Refundable Deposit <Info className="w-4 h-4 text-slate-400" />
                  </span>
                  <span className="font-bold text-slate-900">₹{product.securityDeposit}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-outline !py-4 flex items-center justify-center gap-3 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 btn-primary !py-4 flex items-center justify-center gap-3 group shadow-lg shadow-red-500/20"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Buy Now
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={handleWishlist}
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${isInWishlist(product._id || product.id) ? 'border-red-100 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100'}`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Value Props / Key Features */}
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-3">Key Features</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Truck />, label: 'Free Delivery' },
                  { icon: <ShieldCheck />, label: 'Free Service' },
                  { icon: <RotateCcw />, label: 'Easy Return' },
                ].map((prop, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-slate-50">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[var(--primary)] mx-auto mb-2 shadow-sm">
                      {React.cloneElement(prop.icon, { className: 'w-5 h-5' })}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{prop.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Product Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.specifications && Object.keys(
              product.specifications instanceof Map 
                ? Object.fromEntries(product.specifications) 
                : product.specifications
            ).length > 0 ? (
              Object.entries(
                product.specifications instanceof Map 
                  ? Object.fromEntries(product.specifications) 
                  : product.specifications
              ).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{key}</span>
                  <span className="text-slate-900 font-bold text-lg">{val || 'N/A'}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No specifications available for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
