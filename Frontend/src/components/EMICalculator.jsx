import React, { useState } from 'react';
import { IndianRupee, Calculator, Info } from 'lucide-react';

const EMICalculator = () => {
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  
  const calculateEMI = () => {
    // Basic rental logic: Rent is approx 2-4% of product value per month
    // Lower tenure = higher rent percentage
    const baseRate = tenure <= 6 ? 0.04 : tenure <= 12 ? 0.03 : 0.025;
    const baseRent = amount * baseRate;
    const gst = baseRent * 0.18;
    return Math.round(baseRent + gst);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Rental Calculator</h3>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-4">
            <label className="font-bold text-slate-700">Product Value</label>
            <span className="text-[var(--primary)] font-bold text-lg">₹{amount.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="5000" 
            max="200000" 
            step="5000"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <label className="font-bold text-slate-700">Tenure (Months)</label>
            <span className="text-[var(--primary)] font-bold text-lg">{tenure} Months</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[3, 6, 12, 24].map((m) => (
              <button 
                key={m}
                onClick={() => setTenure(m)}
                className={`py-3 rounded-xl font-bold transition-all border-2 ${tenure === m ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm mb-2">Estimated Monthly Rent</p>
            <p className="text-4xl font-black text-slate-900 flex items-center justify-center gap-1">
              <IndianRupee className="w-8 h-8" /> {calculateEMI()}
            </p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">(Includes 18% GST)</p>
          </div>
        </div>

        <div className="flex gap-3 items-start bg-blue-50 p-4 rounded-xl">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Actual rent may vary based on product category, brand, and current offers. This is an estimated value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
