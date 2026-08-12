import React from 'react';
import { ShieldCheck, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 md:pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          <div className="lg:col-span-7">
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs md:text-sm mb-3 block">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.15] tracking-tight">
              Making Quality Living <br /> <span className="text-[var(--primary)]">Affordable for All</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
              Founded in 2024, RentEase started with a simple mission: To enable modern Indians to live in their dream homes without the burden of heavy upfront ownership costs. We provide premium furniture and appliances on flexible rental plans.
            </p>
            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-w-[160px]">
                <p className="text-4xl font-extrabold text-[var(--primary)] mb-1">50K+</p>
                <p className="text-slate-500 font-semibold text-sm">Happy Customers</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-w-[160px]">
                <p className="text-4xl font-extrabold text-slate-900 mb-1">15+</p>
                <p className="text-slate-500 font-semibold text-sm">Cities Covered</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-red-100 rounded-[3rem] -rotate-2"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" 
              className="rounded-[2.5rem] relative z-10 shadow-2xl w-full h-[450px] object-cover" 
              alt="RentEase Team"
            />
          </div>
        </section>

        {/* Values Section Grid */}
        <section className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm">
          <div className="text-center mb-14">
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-xs mb-2 block">Our Ethos</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">The Values We Live By</h2>
            <p className="text-slate-500 text-sm md:text-base">How we maintain the highest standards for every subscriber</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <ShieldCheck />, title: 'Quality First', desc: 'Every item undergoes a rigorous 25-point quality check and deep sanitation before delivery.' },
              { icon: <Heart />, title: 'Customer Love', desc: 'Our dedicated support team is obsessed with making your rental experience completely hassle-free.' },
              { icon: <Globe />, title: 'Sustainability', desc: 'By promoting a circular sharing economy, we actively reduce furniture waste in landfills.' }
            ].map((value, i) => (
              <div key={i} className="text-center group p-6 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[var(--primary)] mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {React.cloneElement(value.icon, { className: 'w-8 h-8' })}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
