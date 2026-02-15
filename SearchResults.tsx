
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import BrandLogo from '../components/BrandLogo';
import { SlidersHorizontal, SearchX, Search, ChevronDown, ChevronUp, Star, RotateCcw } from 'lucide-react';
import { ProductSkeleton, FilterSkeleton } from '../components/Skeleton';
import { CartItem } from '../types';

interface SearchResultsProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ wishlist, onToggleWishlist, onAddToCart }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const subCategory = searchParams.get('subCategory') || '';
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  const priceOptions = [0, 500, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 100000, 200000];

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    // Ensure 'popular' brands like Whirlpool are available if category matches
    PRODUCTS.forEach(p => {
      const matchesSearch = query ? (p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())) : true;
      const matchesCategory = category ? p.category === category : true;
      const matchesSubCategory = subCategory ? p.subCategory === subCategory : true;
      if (matchesSearch && matchesCategory && matchesSubCategory) {
        brands.add(p.brand);
      }
    });
    return Array.from(brands).sort();
  }, [query, category, subCategory]);

  const displayedBrands = useMemo(() => {
    const filtered = availableBrands.filter(b => 
      b.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
    return showAllBrands ? filtered : filtered.slice(0, 10);
  }, [availableBrands, brandSearchTerm, showAllBrands]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = query ? (p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())) : true;
      const matchesCategory = category ? p.category === category : true;
      const matchesSubCategory = subCategory ? p.subCategory === subCategory : true;
      
      const matchesPrice = p.price >= minPrice && (maxPrice >= 200000 ? true : p.price <= maxPrice);
      
      const matchesBrand = selectedBrands.length > 0 ? selectedBrands.includes(p.brand) : true;
      return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice && matchesBrand;
    });
  }, [query, category, subCategory, minPrice, maxPrice, selectedBrands]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(200000);
    setIsInitialLoading(true);
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, category, subCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handleResetPrice = () => {
    setMinPrice(0);
    setMaxPrice(200000);
  };

  const isPriceFiltered = minPrice !== 0 || maxPrice !== 200000;

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
      {/* Sidebar Filters */}
      <aside className="hidden lg:block w-72 bg-white border shrink-0 rounded shadow-sm h-max sticky top-20 transition-all duration-300">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-black text-gray-800 uppercase tracking-tight text-sm">Filters</h2>
          <SlidersHorizontal size={16} className="text-gray-400"/>
        </div>
        
        <div className="p-4 space-y-8">
          {isInitialLoading ? (
            <FilterSkeleton />
          ) : (
            <>
              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[10px] uppercase text-gray-400 tracking-[0.2em]">Price Range</h3>
                  {isPriceFiltered && (
                    <button 
                      onClick={handleResetPrice}
                      className="text-[10px] text-[#2874f0] font-black hover:underline uppercase tracking-tighter flex items-center gap-1"
                    >
                      <RotateCcw size={10} /> Clear
                    </button>
                  )}
                </div>

                <div className="relative h-1 bg-gray-100 rounded-full mb-6 mx-2">
                  <div 
                    className="absolute h-full bg-[#2874f0] rounded-full transition-all duration-300"
                    style={{ 
                      left: `${(priceOptions.indexOf(minPrice) / (priceOptions.length - 1)) * 100}%`,
                      right: `${100 - (priceOptions.indexOf(maxPrice) / (priceOptions.length - 1)) * 100}%`
                    }}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-1 ml-1">Min</span>
                    <select 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full border p-2 text-xs font-bold rounded bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2874f0] transition-all cursor-pointer"
                    >
                        {priceOptions.filter(p => p < maxPrice).map(price => (
                          <option key={price} value={price}>₹{price.toLocaleString()}</option>
                        ))}
                    </select>
                  </div>
                  <span className="text-gray-300 text-xs font-bold mt-5">TO</span>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-1 ml-1">Max</span>
                    <select 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full border p-2 text-xs font-bold rounded bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2874f0] transition-all cursor-pointer"
                    >
                        {priceOptions.filter(p => p > minPrice).map(price => (
                          <option key={price} value={price}>₹{price.toLocaleString()}{price === 200000 ? '+' : ''}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[10px] uppercase text-gray-400 tracking-[0.2em]">Select Brand</h3>
                  {selectedBrands.length > 0 && (
                    <button 
                      onClick={() => setSelectedBrands([])}
                      className="text-[10px] text-[#2874f0] font-black hover:underline uppercase tracking-tighter"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Brand Search Bar */}
                <div className="relative mb-4 group">
                  <input 
                    type="text"
                    placeholder="Search Brand"
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border-b text-xs outline-none focus:border-[#2874f0] focus:bg-white transition-all"
                  />
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2874f0]" />
                </div>

                {/* Brand Checkboxes with Stylized Brand Logos */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                  {displayedBrands.length > 0 ? (
                    displayedBrands.map(brand => (
                      <label 
                        key={brand} 
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer group transition-all border ${
                          selectedBrands.includes(brand) ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative flex items-center shrink-0">
                          <input 
                            type="checkbox" 
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded checked:bg-[#2874f0] checked:border-[#2874f0] transition-all cursor-pointer" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <BrandLogo brand={brand} size="sm" className="justify-start opacity-70 group-hover:opacity-100" />
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 font-bold uppercase py-2">No matching brands</p>
                  )}
                </div>

                {availableBrands.length > 10 && !brandSearchTerm && (
                  <button 
                    onClick={() => setShowAllBrands(!showAllBrands)}
                    className="mt-4 text-[10px] font-black text-[#2874f0] flex items-center gap-1 uppercase tracking-widest hover:underline"
                  >
                    {showAllBrands ? (
                      <><ChevronUp size={12} /> Show Less</>
                    ) : (
                      <><ChevronDown size={12} /> Show {availableBrands.length - 10} More</>
                    )}
                  </button>
                )}
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="font-black text-[10px] uppercase text-gray-400 mb-4 tracking-[0.2em]">Customer Ratings</h3>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map(stars => (
                    <label key={stars} className="flex items-center gap-3 text-xs cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 border-2 rounded-full border-gray-300 text-[#2874f0] focus:ring-0 cursor-pointer" />
                      <span className="flex items-center gap-1 font-bold text-gray-600 group-hover:text-gray-900">
                        {stars} <Star size={12} className="text-[#2874f0]" fill="currentColor" /> & Above
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-white border rounded shadow-sm mb-4 overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              {query ? `Results for "${query}"` : category ? `Browse ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
              <span className="text-xs text-gray-400 ml-3 font-black uppercase tracking-widest">
                ({isInitialLoading ? '...' : filteredProducts.length} items found)
              </span>
            </h1>
            {subCategory && (
              <p className="text-[10px] text-[#2874f0] font-black uppercase tracking-widest mt-1">Filtering by: {subCategory}</p>
            )}
          </div>
          
          <div className="flex gap-8 px-4 py-3 bg-gray-50/50 text-xs font-bold no-scrollbar overflow-x-auto border-b">
             <span className="text-gray-400 uppercase tracking-[0.2em]">Sort By:</span>
             <button className="text-[#2874f0] border-b-2 border-[#2874f0] pb-1 uppercase tracking-widest">Popularity</button>
             <button className="text-gray-500 hover:text-gray-800 uppercase tracking-widest">Price: Low to High</button>
             <button className="text-gray-500 hover:text-gray-800 uppercase tracking-widest">Price: High to Low</button>
             <button className="text-gray-500 hover:text-gray-800 uppercase tracking-widest">Newest First</button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {isInitialLoading ? (
            Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            <>
              {filteredProducts.map(p => (
                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <ProductCard 
                    product={p} 
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
              
              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-24 bg-white border rounded shadow-sm">
                   <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SearchX size={48} className="text-gray-200" />
                   </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">No results matched</h3>
                  <p className="text-sm text-gray-500 px-8 max-w-sm mx-auto leading-relaxed">
                    We couldn't find anything matching your filters. Try adjusting the price range or clearing selected brands.
                  </p>
                  <button 
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(200000);
                      setSelectedBrands([]);
                      setBrandSearchTerm('');
                    }}
                    className="mt-8 bg-[#2874f0] text-white px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
