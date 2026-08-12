import React, { useState } from 'react';
import { MapPin, Calendar, CreditCard, ChevronRight, CheckCircle2, Truck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    flat: '',
    area: '',
    pincode: '',
    city: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const [location, setLocation] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);

  // Generate next 7 days starting from tomorrow
  const getDeliveryDates = () => {
    const dates = [];
    for (let i = 1; i <= 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        dayNum: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        dayName: date.toLocaleString('default', { weekday: 'short' }),
        full: date
      });
    }
    return dates;
  };

  const deliveryDates = getDeliveryDates();

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setFetchingLocation(false);
        toast.success('High-accuracy location captured!');
      },
      (error) => {
        console.error('Error fetching location:', error);
        toast.error('Unable to fetch precise location. Please enter manually.');
        setFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setPlacingOrder(true);

    // Get user from local storage or use Guest
    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const userName = userData ? userData.name : 'Guest User';
    const userEmail = userData ? userData.email : null;
    const userMobile = userData ? userData.mobile : '';

    const depositTotal = cartItems.reduce((acc, item) => acc + (item.securityDeposit * item.quantity), 0);
    const gstTotal = Math.round(cartTotal * 0.18);
    const totalAmount = cartTotal + depositTotal + gstTotal;
    
    const finalizeOrder = (paymentId = 'COD') => {
      const selectedDelivery = deliveryDates[selectedDate];
      const newOrder = {
        id: '#ORD-' + Math.floor(1000 + Math.random() * 9000),
        user: userName,
        product: cartItems.map(item => item.name).join(', '),
        amount: `₹${totalAmount}`,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        tenure: cartItems[0]?.tenure || '6 Months',
        deliveryDate: `${selectedDelivery.dayNum} ${selectedDelivery.month}`,
        items: cartItems,
        address: `${address.flat}, ${address.area}, ${address.city} - ${address.pincode}`,
        location: location,
        paymentMethod: paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery',
        paymentId: paymentId
      };

      // Save to MongoDB (Order)
      fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      .then(res => res.json())
      .then(data => console.log('✅ Order saved to MongoDB:', data))
      .catch(err => console.error('❌ MongoDB Order Error:', err));

      // Save to MongoDB (Payment Record)
      fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: userName,
          paymentType: paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery',
          amount: totalAmount,
          orderId: newOrder.id,
          transactionId: paymentId
        })
      })
      .then(res => res.json())
      .then(data => console.log('✅ Payment recorded in Atlas:', data))
      .catch(err => console.error('❌ Payment Recording Error:', err));

      // Save to local storage for Admin to see
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      localStorage.setItem('adminOrders', JSON.stringify([newOrder, ...existingOrders]));

      // Update user's total rentals count in Admin Panel
      const existingUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
      if (userEmail) {
        const updatedUsers = existingUsers.map(u => {
          if (u.email === userEmail) {
            return { ...u, rentals: (u.rentals || 0) + 1 };
          }
          return u;
        });
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      }

      // Send confirmation email via backend
      if (userEmail) {
        fetch(`${API_BASE_URL}/orders/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder, userEmail: userEmail })
        })
        .then(res => res.json())
        .then(data => console.log('Email Status:', data))
        .catch(err => console.error('Email Error:', err))
        .finally(() => {
          clearCart();
          toast.success('Order placed successfully! We will contact you soon.');
          setPlacingOrder(false);
          navigate('/');
        });
      } else {
        clearCart();
        toast.success('Order placed successfully! We will contact you soon.');
        setPlacingOrder(false);
        navigate('/');
      }
    };

    if (paymentMethod === 'online') {
      try {
        const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount })
        });
        
        const orderData = await response.json();

        if (!response.ok) {
          throw new Error(orderData.error || 'Failed to create order');
        }
        
        // Fetch Key ID from backend to be safe
        const keyResponse = await fetch(`${API_BASE_URL}/payment/get-key`);
        const { key } = await keyResponse.json();

        const options = {
          key: key, 
          amount: orderData.amount,
          currency: "INR",
          name: "RentEase",
          description: "Furniture & Appliance Rental",
          order_id: orderData.id,
          handler: function (response) {
            finalizeOrder(response.razorpay_payment_id);
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: userMobile
          },
          theme: {
            color: "#ef4444"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response){
          toast.error('Payment failed: ' + response.error.description);
          setPlacingOrder(false);
        });
      } catch (error) {
        toast.error('Error initializing payment. Please try again.');
        setPlacingOrder(false);
      }
    } else {
      finalizeOrder();
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2">
            {/* Steps Progress */}
            <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4">
              {[
                { id: 1, label: 'Delivery Address', icon: <MapPin className="w-4 h-4" /> },
                { id: 2, label: 'Schedule Visit', icon: <Calendar className="w-4 h-4" /> },
                { id: 3, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> }
              ].map((s) => (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-3 flex-shrink-0 ${step === s.id ? 'text-[var(--primary)]' : step > s.id ? 'text-green-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step === s.id ? 'border-[var(--primary)] bg-red-50' : step > s.id ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">{s.label}</span>
                  </div>
                  {s.id < 3 && <ChevronRight className="text-slate-300 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <MapPin className="text-[var(--primary)]" /> Where should we deliver?
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Flat / House No. / Building Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 402, Sunshine Apartments" 
                        className="input-field"
                        value={address.flat}
                        onChange={(e) => setAddress({...address, flat: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Area / Locality / Street</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Viman Nagar" 
                        className="input-field"
                        value={address.area}
                        onChange={(e) => setAddress({...address, area: e.target.value})}
                      />
                      <div className="pt-2">
                        <button 
                          type="button"
                          onClick={fetchLocation}
                          disabled={fetchingLocation}
                          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        >
                          <MapPin className="w-3 h-3 text-red-500" />
                          {fetchingLocation ? 'Detecting...' : location ? 'Precise Location Captured' : 'Auto-detect Precise Location'}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Pincode</label>
                      <input 
                        type="text" 
                        placeholder="411001" 
                        className="input-field"
                        value={address.pincode}
                        onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                      <input type="text" placeholder="Pune" disabled className="input-field bg-slate-50 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full md:w-auto px-12 !py-4">Continue to Schedule</button>
              </motion.div>
            )}

            {/* Step 2: Schedule */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Truck className="text-[var(--primary)]" /> Pick a Delivery Date
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {deliveryDates.map((date, index) => (
                      <button 
                        key={index} 
                        onClick={() => setSelectedDate(index)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${selectedDate === index ? 'border-[var(--primary)] bg-red-50 text-[var(--primary)]' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <p className="text-xs font-bold uppercase mb-1">{date.month}</p>
                        <p className="text-2xl font-bold">{date.dayNum}</p>
                        <p className="text-xs text-slate-500">{date.dayName}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-10 p-6 bg-slate-50 rounded-2xl flex gap-4">
                    <Info className="text-slate-400 w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Delivery Slot</p>
                      <p className="text-sm text-slate-500">Our team will arrive between 10:00 AM and 6:00 PM on the selected date.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-outline px-8 !py-4">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-grow px-12 !py-4">Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <CreditCard className="text-[var(--primary)]" /> Choose Payment Method
                  </h2>
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[var(--primary)] bg-red-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input type="radio" name="pay" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-6 h-6 accent-[var(--primary)]" />
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900">Online Payment</p>
                        <p className="text-sm text-slate-500">Credit/Debit Card, UPI, Netbanking via Razorpay</p>
                      </div>
                      <img src="https://razorpay.com/favicon.png" className="w-8 h-8 opacity-50" />
                    </label>
                    <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[var(--primary)] bg-red-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-6 h-6 accent-[var(--primary)]" />
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-sm text-slate-500">Pay at the time of delivery (Subject to verification)</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="btn-outline px-8 !py-4">Back</button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={placingOrder}
                    className="btn-primary flex-grow px-12 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? 'Placing Order...' : 'Pay & Place Order'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Review Order</h3>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={item.image || (item.images && item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-slate-900 truncate w-40">{item.name}</p>
                      <p className="text-xs text-slate-500">₹{item.price} x {item.tenure || 6} Months</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal Rent</span>
                  <span className="font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Security Deposit</span>
                  <span className="font-bold">₹{cartItems.reduce((acc, item) => acc + (item.securityDeposit * item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-bold">₹{Math.round(cartTotal * 0.18)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-lg pt-4 border-t border-dashed border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-[var(--primary)]">₹{Math.round(cartTotal * 1.18 + cartItems.reduce((acc, item) => acc + (item.securityDeposit * item.quantity), 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
