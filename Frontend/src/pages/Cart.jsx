import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-24 min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10 text-center max-w-md">Looks like you haven't added any furniture or appliances yet. Start exploring our collections!</p>
        <Link to="/products" className="btn-primary flex items-center gap-2">
          Browse Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-10">Your Rental Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.tenure}`} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 group">
                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500">{item.category} • {item.tenure} Months Tenure</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.tenure)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1 px-2 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.tenure, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 transition-all shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-slate-900 min-w-[1rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.tenure, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Monthly Rent</p>
                      <p className="text-xl font-bold text-slate-900">₹{item.rent * item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-32">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Monthly Rent Total</span>
                  <span className="font-bold text-slate-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Deposit</span>
                  <span className="font-bold text-slate-900">₹{cartItems.reduce((acc, item) => acc + (item.securityDeposit * item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-bold text-slate-900">₹{Math.round(cartTotal * 0.18)}</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Initial Payable</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[var(--primary)]">₹{Math.round(cartTotal * 1.18 + cartItems.reduce((acc, item) => acc + (item.securityDeposit * item.quantity), 0))}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Incl. deposit & GST</p>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full !py-4 flex items-center justify-center gap-3">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed font-medium">
                  Your deposit is 100% refundable. We provide free delivery, installation and lifetime maintenance on all items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
