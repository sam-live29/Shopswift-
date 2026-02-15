
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, User as UserIcon, Menu, X, Heart, Package, LogOut, 
  ChevronRight, LayoutGrid, Star, HelpCircle, ShieldCheck, Clock, TrendingUp,
  Store, Bell, Ticket, Gift, Download, PhoneCall, ChevronDown, MoreVertical
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';

interface SuggestionItem {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
  category: string;
}

interface KeywordSuggestion {
  text: string;
  category?: string;
}

interface HeaderProps {
  cartCount: number;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [notificationCount, setNotificationCount] = useState(3); 
  
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('shopswift_recent_searches');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch (e) { console.error(e); }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = () => {
      const q = searchQuery.trim().toLowerCase();
      if (q.length > 1) {
        // 1. Generate Product Suggestions
        const filteredProducts = PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        ).slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          brand: p.brand,
          category: p.category
        }));
        setSuggestions(filteredProducts);

        // 2. Generate Keyword Suggestions
        const keywords: KeywordSuggestion[] = [];
        
        // Match Categories
        CATEGORIES.forEach(cat => {
          if (cat.name.toLowerCase().includes(q)) {
            keywords.push({ text: cat.name, category: cat.name });
          }
        });

        // Match Brands
        const matchedBrands = Array.from(new Set(PRODUCTS.map(p => p.brand)))
          .filter(brand => brand.toLowerCase().includes(q))
          .slice(0, 3);
        
        matchedBrands.forEach(brand => {
          keywords.push({ text: brand });
        });

        setKeywordSuggestions(keywords.slice(0, 4));
      } else {
        setSuggestions([]);
        setKeywordSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('shopswift_recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (q?: string) => {
    const query = q || searchQuery;
    if (query.trim()) {
      saveRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
      setKeywordSuggestions([]);
      setSearchQuery(query);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    saveRecentSearch(suggestion.name);
    navigate(`/product/${suggestion.id}`);
    setSuggestions([]);
    setKeywordSuggestions([]);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const trendingSearches = ['iPhone 15 Pro', 'Wireless Earbuds', 'Smart Watches', 'Gaming Laptops'];

  return (
    <header className="bg-[#2874f0] text-white z-50 shadow-md transition-all duration-300 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex flex-col items-start shrink-0 group"
            aria-label="ShopSwift Home"
          >
            <span className="text-xl italic font-bold leading-none tracking-tight group-hover:scale-105 transition-transform">ShopSwift</span>
            <span className="text-[10px] italic flex items-center font-medium opacity-90">
              Plus <span className="text-yellow-400 ml-1">✦</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={dropdownRef}>
            <div className="flex w-full bg-white rounded shadow-sm overflow-hidden border focus-within:ring-2 ring-blue-200 transition-all">
              <input
                type="text"
                className="w-full py-2 px-4 bg-white text-black focus:outline-none placeholder-gray-500"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                aria-label="Search for products, brands and more"
                autoComplete="off"
              />
              <button 
                onClick={() => handleSearch()}
                className="p-2 text-[#2874f0] hover:bg-gray-50 transition-colors"
                aria-label="Submit search"
              >
                <Search size={20} />
              </button>
            </div>
            
            {/* Search Dropdown (Desktop) */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b mt-0.5 z-50 border border-gray-100 overflow-hidden animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
                
                {searchQuery.trim().length > 1 && (keywordSuggestions.length > 0 || suggestions.length > 0) ? (
                  <div className="divide-y">
                    {/* Keyword Suggestions */}
                    {keywordSuggestions.length > 0 && (
                      <div>
                        {keywordSuggestions.map((kw, i) => (
                          <button
                            key={i}
                            onClick={() => handleSearch(kw.text)}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors border-b last:border-b-0"
                          >
                            <Search size={16} className="text-gray-400" />
                            <span className="text-sm font-medium">
                              {kw.text} {kw.category && <span className="text-blue-500 font-bold ml-1">in {kw.category}</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product Suggestions */}
                    {suggestions.length > 0 && (
                      <div>
                        <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <LayoutGrid size={12}/> Suggested Products
                        </div>
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center gap-4 transition-colors group"
                          >
                            <div className="w-12 h-12 bg-white border rounded p-1 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <img src={suggestion.image} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-0.5">{suggestion.brand}</div>
                              <div className="text-sm font-medium text-gray-800 truncate">{suggestion.name}</div>
                              <div className="text-[10px] text-blue-500 font-bold mt-0.5 uppercase tracking-widest">{suggestion.category}</div>
                            </div>
                            <div className="text-sm font-bold text-gray-900 shrink-0">
                              ₹{suggestion.price.toLocaleString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={() => handleSearch()}
                      className="w-full py-3 text-center text-[#2874f0] text-xs font-bold bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {recentSearches.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recent Searches</div>
                        {recentSearches.map((s, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSearch(s)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                          >
                            <Clock size={14} className="text-gray-300" /> {s}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trending Searches</div>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {trendingSearches.map((s, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSearch(s)}
                            className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                          >
                            <TrendingUp size={14} className="text-[#2874f0]" /> {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav Actions - Desktop */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            {user ? (
              <div className="group relative">
                <button 
                  className="flex items-center gap-1 font-semibold hover:opacity-80 py-2"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {user.name}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="hidden group-hover:block absolute top-full right-0 mt-0 w-52 bg-white text-gray-800 shadow-xl rounded-sm border py-2 animate-fade-in">
                  <Link to="/account" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><UserIcon size={16} className="text-[#2874f0]"/> My Profile</Link>
                  <Link to="/orders" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><Package size={16} className="text-[#2874f0]"/> Orders</Link>
                  <Link to="/wishlist" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><Heart size={16} className="text-[#2874f0]"/> Wishlist</Link>
                  <Link to="/coupons" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><Ticket size={16} className="text-[#2874f0]"/> Coupons</Link>
                  <button onClick={onLogout} className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm text-red-600"><LogOut size={16}/> Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1 rounded font-semibold text-sm hover:bg-gray-100 transition-colors shadow-sm">
                Login
              </Link>
            )}
            
            <Link to="/seller" className="hidden lg:flex items-center gap-1 font-semibold hover:opacity-80">
              <Store size={18} />
              <span className="whitespace-nowrap">Become a Seller</span>
            </Link>

            {/* Top-level Notification Icon */}
            <Link to="/notifications" className="relative group p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Notifications">
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#2874f0]">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Desktop More Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 font-semibold hover:opacity-80 py-2">
                More
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="hidden group-hover:block absolute top-full right-0 mt-0 w-56 bg-white text-gray-800 shadow-xl rounded-sm border py-2 animate-fade-in">
                <Link to="/help" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><PhoneCall size={16} className="text-[#2874f0]"/> 24x7 Customer Care</Link>
                <Link to="/advertise" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm border-b"><TrendingUp size={16} className="text-[#2874f0]"/> Advertise</Link>
                <Link to="/download" className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-sm"><Download size={16} className="text-[#2874f0]"/> Download App</Link>
              </div>
            </div>
            
            <Link to="/cart" className="flex items-center gap-2 font-semibold hover:opacity-80 relative" aria-label={`View cart with ${cartCount} items`}>
              <ShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/search-interface" className="p-1 text-white active:text-yellow-400" aria-label="Open mobile search">
              <Search size={22} />
            </Link>

            <Link to="/notifications" className="relative p-1" aria-label="Notifications">
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#2874f0]">
                  {notificationCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-1" aria-label={`View cart with ${cartCount} items`}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#2874f0]">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-1"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="absolute top-0 left-0 w-[85%] max-w-xs h-full bg-white text-gray-800 shadow-2xl flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="bg-[#2874f0] p-6 text-white shrink-0">
               <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-full border border-white/10">
                    <UserIcon size={24}/>
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{user ? `Hello, ${user.name}` : 'Welcome'}</p>
                    {user ? (
                      <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">Logout <LogOut size={12}/></button>
                    ) : (
                      <Link to="/login" className="text-xs text-blue-100" onClick={() => setIsMenuOpen(false)}>Login & Create Account</Link>
                    )}
                  </div>
               </div>
               <div className="flex justify-between mt-6 text-xs font-bold tracking-wider opacity-80">
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-1">
                    <Package size={18}/>
                    <span>Orders</span>
                  </Link>
                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-1">
                    <Heart size={18}/>
                    <span>Wishlist</span>
                  </Link>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-1">
                    <ShoppingCart size={18}/>
                    <span>Cart</span>
                  </Link>
               </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto py-2 bg-gray-50">
              
              <div className="bg-white mb-2 shadow-sm">
                <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b">
                  <Star size={12} className="text-yellow-500"/> Special Zone
                </div>
                <Link to="/plus" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Star size={18} className="text-yellow-500"/>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">ShopSwift Plus Zone</span>
                </Link>
              </div>

              <div className="bg-white mb-2 shadow-sm">
                <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b">
                  <LayoutGrid size={12} className="text-[#2874f0]"/> All Categories
                </div>
                <nav className="divide-y">
                  {CATEGORIES.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/search?category=${cat.id}`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 active:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl w-6 text-center">{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300"/>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="bg-white shadow-sm mb-2">
                <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b">
                  <MoreVertical size={12} className="text-[#2874f0]"/> More on ShopSwift
                </div>
                <nav className="divide-y">
                  <Link to="/gift-cards" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-blue-50">
                    <Gift size={18} className="text-[#2874f0]"/>
                    <span className="text-sm font-medium text-gray-700">Gift Cards</span>
                  </Link>
                  <Link to="/coupons" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-blue-50">
                    <Ticket size={18} className="text-green-600"/>
                    <span className="text-sm font-medium text-gray-700">My Coupons</span>
                  </Link>
                  <Link to="/notifications" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-blue-50">
                    <Bell size={18} className="text-orange-500"/>
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                  </Link>
                </nav>
              </div>

              <div className="bg-white shadow-sm mb-10">
                <nav className="divide-y">
                  <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <HelpCircle size={18} className="text-gray-400"/>
                    <span className="text-sm font-medium text-gray-700">Help Center</span>
                  </Link>
                  <Link to="/legal" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <ShieldCheck size={18} className="text-gray-400"/>
                    <span className="text-sm font-medium text-gray-700">Legal</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t bg-gray-50 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shopping with trust</p>
                <Store size={14} className="text-gray-300"/>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={24} className="text-green-600 shrink-0"/>
                <span className="text-[10px] text-gray-500 leading-tight">100% Genuine Products, Secure Payments & Free Returns on Most Items.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
