import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const ProductListing = () => {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const cat = searchParams.get('cat') || searchParams.get('category');
    const sub = searchParams.get('sub') || searchParams.get('search');
    if (cat) {
      setActiveCategory(cat);
      setSubFilter('');
    } else {
      setActiveCategory('All');
    }
    if (sub) {
      setSubFilter(sub);
      setSearchQuery('');
    } else {
      setSubFilter('');
    }
  }, [searchParams]);

  const filteredAndSortedProducts = products
    .filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSub = !subFilter || 
        p.name.toLowerCase().includes(subFilter.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(subFilter.toLowerCase())) ||
        (p.type && p.type.toLowerCase().includes(subFilter.toLowerCase()));
      const matchesPrice = p.rentPrice <= maxPrice;
      return matchesCategory && matchesSearch && matchesSub && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.rentPrice - b.rentPrice;
      if (sortBy === 'price-high') return b.rentPrice - a.rentPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id; // newest arrivals
    });

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse All Products</h1>
            <p className="text-slate-500">Find the perfect items for your home at best rental prices</p>
          </div>
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-red-500/20"
            />
            <Search className="absolute right-6 top-4 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--primary)]" /> Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-4">Categories</h4>
                  <div className="space-y-3">
                    {['All', 'Furniture', 'Appliances', 'Office'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={activeCategory === cat}
                          onChange={() => setActiveCategory(cat)}
                          className="w-5 h-5 accent-[var(--primary)]" 
                        />
                        <span className={`transition-colors ${activeCategory === cat ? 'text-[var(--primary)] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-4">Price Range (Monthly)</h4>
                  <input 
                    type="range" 
                    className="w-full accent-[var(--primary)]" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold">
                    <span>₹0</span>
                    <span className="text-[var(--primary)]">Up to ₹{maxPrice}</span>
                    <span>₹5000+</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-4">Tenure Availability</h4>
                  <div className="space-y-3">
                    {['3 Months', '6 Months', '12 Months'].map(t => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded accent-[var(--primary)]" />
                        <span className="text-slate-600">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--primary)] p-6 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-2">Bulk Discount</h4>
                <p className="text-sm text-white/80 mb-4">Rent for 12+ months and get 20% off on your first month.</p>
                <button className="text-white bg-white/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/30 transition-all">Learn More</button>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-slate-500 font-medium">Showing <span className="text-slate-900 font-bold">{filteredAndSortedProducts.length}</span> results</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border-none rounded-xl shadow-sm font-semibold text-sm text-slate-900 focus:ring-2 focus:ring-red-500/20 px-4 py-2 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {setActiveCategory('All'); setSearchQuery(''); setMaxPrice(5000);}}
                  className="text-[var(--primary)] font-bold mt-4 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
