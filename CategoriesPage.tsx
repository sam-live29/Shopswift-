
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CATEGORY_METADATA } from '../constants';
import BrandLogo from '../components/BrandLogo';
import { 
  ChevronRight, Sparkles, Zap, TrendingUp, Search, 
  ArrowLeft, Tag, Star, LayoutGrid, Store, CreditCard 
} from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);

  const activeCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === activeCategoryId)!,
    [activeCategoryId]
  );

  const metadata = CATEGORY_METADATA[activeCategoryId];

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Left Navigation Rail */}
      <aside className="w-24 sm:w-64 border-r bg-gray-50 overflow-y-auto no-scrollbar">
        <div className="p-4 border-b bg-white flex items-center gap-2">
           <LayoutGrid size={18} className="text-[#2874f0] hidden sm:block" />
           <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">Departments</span>
        </div>
        <nav className="flex flex-col">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-4 transition-all border-l-4 ${
                activeCategoryId === cat.id 
                  ? 'border-[#2874f0] bg-white text-[#2874f0] shadow-sm' 
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl sm:text-2xl transition-transform group-hover:scale-110">{cat.icon}</span>
              <span className="text-[10px] sm:text-sm font-bold sm:font-black uppercase tracking-tight text-center sm:text-left">
                {cat.name}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#2874f0] mb-1">
                <Sparkles size={16} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured Department</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
                {activeCategory.name} Store
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/search?category=${activeCategoryId}`)}
                className="bg-[#2874f0] text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 active:scale-95 transition-all"
              >
                View Full Collection
              </button>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="mb-8 relative rounded-2xl overflow-hidden h-32 sm:h-48 shadow-lg group cursor-pointer" onClick={() => navigate(`/search?category=${activeCategoryId}`)}>
            <img src={`https://picsum.photos/seed/${activeCategoryId}/1200/400`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 sm:px-10 text-white">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-yellow-400">Festival Deals Live</p>
               <h3 className="text-lg sm:text-3xl font-black uppercase">Up to 80% Off on {activeCategory.name}</h3>
               <p className="text-[10px] sm:text-sm opacity-80 mt-1 font-medium italic">Shop now & get extra 5% off with SuperCoins ★</p>
            </div>
          </div>

          {/* Budget Stores Grid */}
          <div className="mb-10">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tag size={14} className="text-green-500" /> Budget Stores
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metadata.budgetFilters.map((budget, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/search?category=${activeCategoryId}&maxPrice=${budget}`)}
                  className="bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-all group"
                >
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter mb-1">Under</span>
                  <span className="text-xl font-black text-green-800 tracking-tighter">₹{budget.toLocaleString()}</span>
                  <ChevronRight size={14} className="text-green-300 mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Brand Stores */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Store size={14} className="text-[#2874f0]" /> Top Brand Stores
              </h2>
              <button className="text-[10px] font-bold text-[#2874f0] uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {metadata.brands.map((brand, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/search?q=${brand}`)}
                  className="shrink-0 w-24 sm:w-32 bg-gray-50 border rounded-2xl p-4 flex flex-col items-center hover:shadow-xl hover:bg-white transition-all group"
                >
                  <div className="h-10 sm:h-12 flex items-center justify-center mb-3">
                    <BrandLogo brand={brand} size="md" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Enter Store</span>
                    <ChevronRight size={10} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Groups */}
          <div className="space-y-8 pb-10">
            {metadata.groups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#2874f0] rounded-full"></div>
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{group.name}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {group.items.map((item, iIdx) => (
                    <button
                      key={iIdx}
                      onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-blue-50 hover:border-blue-200 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-gray-700 group-hover:text-[#2874f0] transition-colors">{item}</span>
                         <ChevronRight size={14} className="text-gray-300 group-hover:text-[#2874f0] transition-colors" />
                      </div>
                      <div className="mt-3 flex items-center gap-1">
                        <TrendingUp size={10} className="text-orange-500" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Bestseller</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="border-t pt-10 text-center">
             <div className="flex items-center justify-center gap-4 mb-4">
                <CreditCard className="text-[#2874f0]" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">ShopSwift Pay Later • Zero Interest EMI</span>
             </div>
             <p className="text-[10px] text-gray-400 max-w-sm mx-auto font-medium">
               Explore authentic products from verified sellers. Every purchase in {activeCategory.name} is covered by the ShopSwift Guarantee.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
