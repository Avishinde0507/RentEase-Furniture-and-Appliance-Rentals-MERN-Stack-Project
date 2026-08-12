import React, { useState, useEffect } from 'react';
import { Calendar, Clock, IndianRupee, FileText, ChevronRight, CheckCircle2, ShoppingBag, Wrench, Download, Info, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../apiConfig';

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [rentals, setRentals] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [user, setUser] = useState(null);
  
  // Extension Modal State
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [newTenure, setNewTenure] = useState('6 Months');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setUser(userData);
      
      // Fetch live orders from MongoDB Atlas
      fetch(`${API_BASE_URL}/orders/all`)
        .then(res => res.json())
        .then(allOrders => {
          const myOrders = allOrders.filter(order => order.user === userData.name);
          const formattedRentals = myOrders.map(order => {
            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
            return {
              id: order.orderId || order.id || `#ORD-${Math.floor(1000 + Math.random() * 8999)}`,
              name: order.product || (firstItem ? firstItem.name : 'Rental Product'),
              image: firstItem 
                ? (firstItem.image || (firstItem.images && firstItem.images[0])) 
                : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200',
              startDate: order.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              endDate: 'Oct 2026', 
              monthlyRent: firstItem ? (firstItem.rent || firstItem.price || firstItem.rentPrice || 0) : 0,
              status: (order.status === 'Delivered' || order.status === 'Active') ? 'Active' : order.status,
              tenure: order.tenure || '6 Months',
              items: order.items,
              productId: firstItem ? (firstItem._id || firstItem.id) : 'N/A',
              address: order.address
            };
          });
          setRentals(formattedRentals);
        })
        .catch(err => console.error('Live Fetch Error:', err));

      const allMaintenance = JSON.parse(localStorage.getItem('rentease_maintenance')) || [];
      setMaintenanceRequests(allMaintenance.filter(req => req.userId === userData.email || req.userName === userData.name));
    }
  }, []);

  const activeRentals = rentals;
  const pastRentals = [];

  const downloadInvoice = (rental) => {
    const doc = new jsPDF();
    const amount = parseInt(rental.monthlyRent);
    const gst = Math.round(amount * 0.18);
    const total = amount + gst;
    const invoiceId = `INV-${rental.id.replace('#', '')}`;

    // --- Modern Design Elements ---
    // Primary Color: #ef4444 (Red-500)
    // Secondary: #1e293b (Slate-800)
    
    // Header Background
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo / Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('RentEase', 20, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('PREMIUM RENTALS', 20, 32);
    
    // "INVOICE" Label
    doc.setFontSize(24);
    doc.text('INVOICE', 190, 25, { align: 'right' });
    
    // Top Right Info
    doc.setFontSize(10);
    doc.text(`ID: ${invoiceId}`, 190, 32, { align: 'right' });

    // --- Body Sections ---
    let currentY = 55;

    // Invoice Meta Info
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', 20, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Date: ${rental.startDate}`, 20, currentY + 7);
    doc.text(`Order ID: ${rental.id}`, 20, currentY + 12);
    doc.text(`Status: Active`, 20, currentY + 17);

    // Bill To Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Bill To:', 140, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(user?.name || 'Valued Customer', 140, currentY + 7);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(user?.email || '', 140, currentY + 12);

    // Delivery Address Section
    currentY += 30;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Delivery Address:', 20, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitAddress = doc.splitTextToSize(rental.address || 'Not Provided', 80);
    doc.text(splitAddress, 20, currentY + 6);

    // --- Items Table ---
    currentY += 25;
    const tableTop = currentY;
    
    // Header
    doc.setFillColor(30, 41, 59);
    doc.rect(20, tableTop, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Description', 25, tableTop + 8);
    doc.text('Product ID', 85, tableTop + 8);
    doc.text('Tenure', 135, tableTop + 8);
    doc.text('Amount', 175, tableTop + 8, { align: 'right' });

    // Row
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(rental.name, 25, tableTop + 22);
    doc.text(rental.productId.toString(), 85, tableTop + 22);
    doc.text(rental.tenure, 135, tableTop + 22);
    doc.text(`INR ${amount}`, 185, tableTop + 22, { align: 'right' });

    // Table Border Bottom
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(20, tableTop + 30, 190, tableTop + 30);

    // --- Calculations ---
    currentY = tableTop + 45;
    const summaryX = 140;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal:', summaryX, currentY);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${amount}`, 185, currentY, { align: 'right' });
    
    doc.setTextColor(100, 116, 139);
    doc.text('GST (18%):', summaryX, currentY + 8);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${gst}`, 185, currentY + 8, { align: 'right' });
    
    // Total Divider
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.5);
    doc.line(135, currentY + 12, 190, currentY + 12);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Total Amount:', summaryX, currentY + 22);
    doc.text(`INR ${total}`, 185, currentY + 22, { align: 'right' });

    // --- Footer Section ---
    const pageHeight = doc.internal.pageSize.height;
    
    // Bottom Accent Line
    doc.setFillColor(239, 68, 68);
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Thank you for choosing RentEase! Visit us again at www.rentease.com', 105, pageHeight - 6, { align: 'center' });
    
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated invoice and does not require a physical signature.', 105, pageHeight - 25, { align: 'center' });

    doc.save(`${invoiceId}.pdf`);
  };

  const handleExtendSubmit = async () => {
    if (!selectedRental) return;
    
    const extraMonths = parseInt(newTenure) || 0;
    const rent = parseInt(selectedRental.monthlyRent) || 0;
    const amountToPay = Math.round(rent * extraMonths);

    if (amountToPay <= 0) {
      import('react-hot-toast').then(({ toast }) => {
        toast.error('Invalid amount calculated for extension. Please contact support.');
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (paymentMethod === 'online') {
        // 1. Create Razorpay Order
        const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amountToPay })
        });
        
        const orderData = await response.json();
        if (!response.ok) {
          const errMsg = orderData.error || orderData.message || 'Failed to create order';
          throw new Error(errMsg);
        }

        // 2. Get Razorpay Key
        const keyResponse = await fetch(`${API_BASE_URL}/payment/get-key`);
        const { key } = await keyResponse.json();

        // 3. Open Razorpay Modal
        const options = {
          key: key,
          amount: orderData.amount,
          currency: "INR",
          name: "RentEase",
          description: `Rental Extension - ${selectedRental.name}`,
          order_id: orderData.id,
          handler: async function (response) {
            submitExtensionRequest(response.razorpay_payment_id, 'Paid', amountToPay);
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.mobile
          },
          theme: { color: "#ef4444" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', function (response) {
          import('react-hot-toast').then(({ toast }) => {
            toast.error('Payment failed: ' + response.error.description);
          });
          setIsSubmitting(false);
        });
      } else {
        // Cash on Delivery path
        submitExtensionRequest('COD', 'Pending', amountToPay);
      }

    } catch (error) {
      console.error('Extension Payment Error:', error);
      import('react-hot-toast').then(({ toast }) => {
        toast.error(`Payment Initialization Failed: ${error.message} (Amount: ${amountToPay})`);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitExtensionRequest = async (paymentId, paymentStatus, amountToPay) => {
    try {
      const extendResponse = await fetch(`${API_BASE_URL}/extend/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedRental.id,
          user: user.name,
          product: selectedRental.name,
          currentTenure: selectedRental.tenure,
          requestedTenure: newTenure,
          amount: amountToPay,
          paymentId: paymentId,
          paymentStatus: paymentStatus
        })
      });
      
      const data = await extendResponse.json();
      if (data.success) {
        import('react-hot-toast').then(({ toast }) => {
          toast.success(paymentId === 'COD' ? 'Extension request submitted (COD)!' : 'Payment successful & extension request sent!');
        });
        setIsExtendModalOpen(false);
      }
    } catch (err) {
      console.error('Submit Request Error:', err);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Rentals</h1>
          <p className="text-slate-500">Manage your active rentals, view history, and download invoices.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2">
              <button 
                onClick={() => setActiveTab('active')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'active' ? 'bg-red-50 text-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Active Rentals <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'history' ? 'bg-red-50 text-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Rental History <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('maintenance')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'maintenance' ? 'bg-red-50 text-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Maintenance <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'invoices' ? 'bg-red-50 text-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Invoices <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {activeTab === 'active' && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  Active Rentals <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">{activeRentals.length} {activeRentals.length === 1 ? 'Item' : 'Items'}</span>
                </h2>
                <div className="space-y-6">
                  {activeRentals.length > 0 ? activeRentals.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">{item.id}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{item.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-1.5 rounded-full text-sm">
                            <CheckCircle2 className="w-4 h-4" /> {item.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Start Date</p>
                            <p className="font-bold text-slate-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">End Date</p>
                            <p className="font-bold text-slate-800 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.endDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Monthly Rent</p>
                            <p className="font-bold text-slate-800 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {item.monthlyRent}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Tenure</p>
                            <p className="font-bold text-slate-800">{item.tenure}</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button 
                            className="btn-primary !py-2.5 !text-sm"
                            onClick={() => {
                              setSelectedRental(item);
                              setNewTenure(item.tenure);
                              setIsExtendModalOpen(true);
                            }}
                          >
                            Extend Rental
                          </button>
                          <button className="btn-outline !py-2.5 !text-sm" onClick={() => window.location.href='/maintenance'}>Request Support</button>
                          <button 
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                            onClick={() => downloadInvoice(item)}
                            title="Download Invoice"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                      <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold text-xl">You have no active rentals.</p>
                      <button onClick={() => window.location.href='/products'} className="mt-4 text-[var(--primary)] font-bold hover:underline">Start Browsing Items</button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'history' && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Past Rentals</h2>
                {pastRentals.length > 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 text-left">Product</th>
                          <th className="px-6 py-4 text-left">Date Range</th>
                          <th className="px-6 py-4 text-left">Amount Paid</th>
                          <th className="px-6 py-4 text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pastRentals.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-4">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                                <span className="font-bold text-slate-900">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-sm text-slate-600">{item.startDate} - {item.endDate}</td>
                            <td className="px-6 py-6 font-bold text-slate-900">₹{item.monthlyRent * 3}</td>
                            <td className="px-6 py-6 text-right">
                              <button className="text-[var(--primary)] hover:underline font-bold text-sm">Download</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <Clock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-xl">You have no rental history yet.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'invoices' && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Invoices</h2>
                {activeRentals.filter(r => r.status === 'Active').length > 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 text-left">Invoice #</th>
                          <th className="px-6 py-4 text-left">Product</th>
                          <th className="px-6 py-4 text-left">Product ID</th>
                          <th className="px-6 py-4 text-left">Date</th>
                          <th className="px-6 py-4 text-left">Total Amount</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeRentals.filter(r => r.status === 'Active').map((rental) => {
                          const amount = parseInt(rental.monthlyRent);
                          const gst = Math.round(amount * 0.18);
                          const total = amount + gst;
                          return (
                            <tr key={rental.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-6 font-bold text-slate-400 text-xs">INV-{rental.id.replace('#', '')}</td>
                              <td className="px-6 py-6">
                                <span className="font-bold text-slate-900">{rental.name}</span>
                              </td>
                              <td className="px-6 py-6 text-sm text-slate-500 font-mono">{rental.productId}</td>
                              <td className="px-6 py-6 text-sm text-slate-600">{rental.startDate}</td>
                              <td className="px-6 py-6 font-bold text-slate-900">₹{total}</td>
                              <td className="px-6 py-6 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => downloadInvoice(rental)}
                                  className="text-[var(--primary)] hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ml-auto border border-red-100"
                                >
                                  <Download className="w-4 h-4" /> Download
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-xl">No invoices available.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'maintenance' && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Maintenance Tracking</h2>
                <div className="space-y-6">
                  {maintenanceRequests.length > 0 ? maintenanceRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${req.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            <Wrench className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold text-slate-400 tracking-widest">{req.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {req.status}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{req.product}</h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 mb-1">Issue: {req.type}</p>
                          <p className="text-sm font-bold text-slate-900">{req.issue}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">No maintenance requests found.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Extension Modal */}
      {isExtendModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Extend Your Rental</h3>
            <p className="text-slate-500 mb-8 text-sm">Choose a new tenure for your <strong>{selectedRental?.name}</strong>. Request will be sent for approval.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Select New Tenure</label>
                <div className="grid grid-cols-3 gap-3">
                  {['3 Months', '6 Months', '12 Months'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewTenure(t)}
                      className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${newTenure === t ? 'border-[var(--primary)] bg-red-50 text-[var(--primary)]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${paymentMethod === 'online' ? 'border-[var(--primary)] bg-red-50 text-[var(--primary)]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    Online Pay
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${paymentMethod === 'cod' ? 'border-[var(--primary)] bg-red-50 text-[var(--primary)]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    Pay later (COD)
                  </button>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Monthly Rent</span>
                  <span className="font-bold text-slate-900">₹{selectedRental?.monthlyRent}</span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-500">Extension Period</span>
                  <span className="font-bold text-slate-900">{newTenure}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-slate-900">Total Extra Amount</span>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Payment via Razorpay
                    </p>
                  </div>
                  <span className="text-xl font-bold text-[var(--primary)]">₹{Math.round((parseInt(selectedRental?.monthlyRent) || 0) * (parseInt(newTenure) || 0))}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Note: This payment is for the extra tenure requested. Your regular monthly billing cycle will continue as per the original agreement.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsExtendModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleExtendSubmit}
                  disabled={isSubmitting}
                  className="flex-1 btn-primary !py-4 rounded-2xl shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      {paymentMethod === 'online' ? (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          {`Pay ₹${Math.round((parseInt(selectedRental?.monthlyRent) || 0) * (parseInt(newTenure) || 0))}`}
                        </>
                      ) : (
                        'Submit Request'
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
