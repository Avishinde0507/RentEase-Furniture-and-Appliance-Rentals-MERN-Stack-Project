import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section with proper spacing below fixed navbar */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs md:text-sm mb-3 block">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about our rental plans or need assistance with a product? Our dedicated team is here to assist you 24/7.
          </p>
        </div>

        {/* 12-Column Grid Layout: 5 columns for Info, 7 columns for Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (5 Cols): Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-red-50 text-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Email Us</h4>
                  <p className="text-slate-500 text-sm mb-2">For support, inquiries & feedback</p>
                  <a 
                    href="mailto:renteasefurniturerentals@gmail.com" 
                    className="font-bold text-[var(--primary)] text-sm md:text-base hover:underline break-all block"
                  >
                    renteasefurniturerentals@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Call Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Call Us</h4>
                  <p className="text-slate-500 text-sm mb-2">Monday - Saturday, 9am - 6pm IST</p>
                  <a 
                    href="tel:+919518386406" 
                    className="font-bold text-blue-600 text-base md:text-lg hover:underline block"
                  >
                    +91 9518386406
                  </a>
                </div>
              </div>
            </div>

            {/* Office Location Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Visit Our Office</h4>
                  <p className="text-slate-500 text-sm mb-2">Corporate Headquarters</p>
                  <p className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
                    Main Road, Talegaon Dabhade,<br /> Pune, Maharashtra - 410507
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours Badge */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm">Quick Response Guarantee</h5>
                <p className="text-slate-400 text-xs mt-0.5">We typically respond to messages within 2 hours during working hours.</p>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Send Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <MessageSquare className="text-[var(--primary)] w-7 h-7" /> Send us a Message
                </h3>
                <p className="text-slate-500 text-sm">Fill out the form below and we will get back to you promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your full name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help you?" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows="5" 
                    required
                    placeholder="Write your message or inquiry here..." 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field resize-none py-4"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full !py-4 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-red-500/20"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
