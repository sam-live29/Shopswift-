
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, TrendingUp, X, Clock, Mic, Sparkles, Zap, ChevronRight, Star } from 'lucide-react';
import { PRODUCTS } from './constants';

interface SuggestionItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem('shopswift_recent_searches');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.trim().length > 1) {
        const filtered = PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8).map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price
        }));
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('shopswift_recent_searches', JSON.stringify(updated));
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const trending = ['iPhone 15 Pro', 'Wireless Earbuds', 'Smart Watches', 'Gaming Laptops', 'Running Shoes'];

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col md:hidden">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-3 border-b shadow-sm sticky top-0 bg-white shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 relative flex items-center bg-gray-50 rounded-lg border focus-within:bg-white focus-within:border-[#2874f0] transition-all">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-black py-2.5 pl-4 pr-10 rounded-lg text-sm outline-none placeholder-gray-500"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          />
          <div className="absolute right-0 flex items-center pr-2">
            {query ? (
              <button onClick={() => setQuery('')} className="p-2 text-gray-400"><X size={18} /></button>
            ) : (
              <button className="p-2 text-[#2874f0]"><Mic size={18} /></button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {suggestions.length > 0 ? (
          <div className="divide-y animate-in fade-in slide-in-from-top-1">
            <div className="p-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b">Suggested Products</div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => navigate(`/product/${suggestion.id}`)}
                className="w-full text-left px-4 py-3 bg-white active:bg-blue-50 flex items-center gap-4 border-b"
              >
                <div className="w-12 h-12 bg-white border rounded p-1 shrink-0 flex items-center justify-center">
                  <img src={suggestion.image} alt="" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{suggestion.name}</div>
                  <div className="text-xs font-bold text-[#2874f0] mt-0.5">₹{suggestion.price.toLocaleString()}</div>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-3 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Recent Searches
                  </h3>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-2">
                  {recentSearches.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSearch(s)}
                      className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-600 whitespace-nowrap active:bg-blue-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="mb-8">
              <div className="px-4 py-3 border-t">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={12} className="text-orange-500" /> Trending Discoveries
                </h3>
              </div>
              <div className="px-4 grid grid-cols-1 gap-2">
                {trending.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSearch(item)}
                    className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-blue-200 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                    <Search size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Recommendations */}
            <div className="px-4 pb-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[#2874f0]" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended For You</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.slice(0, 4).map(product => (
                  <button 
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white border rounded-xl p-3 flex flex-col gap-2 hover:shadow-lg transition-all text-left"
                  >
                    <div className="aspect-square bg-gray-50 rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                       <img src={product.image} alt="" className="max-w-full max-h-full object-contain" />
                       <div className="absolute top-1 right-1 bg-green-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                         {product.rating} <Star size={8} fill="currentColor" />
                       </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{product.brand}</p>
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-1">
                         <span className="text-xs font-black text-[#2874f0]">₹{product.price.toLocaleString()}</span>
                         <div className="bg-blue-50 p-1.5 rounded-full"><Zap size={10} className="text-[#2874f0]" fill="currentColor" /></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
