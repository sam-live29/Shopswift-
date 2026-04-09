
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, ShoppingCart, X, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from './constants';

interface MobileNavProps {
  cartCount: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ cartCount }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (id: string) => {
    setIsDrawerOpen(false);
    navigate(`/search?category=${id}`);
  };

  const isCategoriesActive = location.pathname === '/categories' || isDrawerOpen;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-[100] sm:hidden flex items-center justify-around h-16 px-2 shadow-[0_-2px_15px_rgba(0,0,0,0.08)]">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#2874f0] scale-110' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <Home size={22} />
          <span className="text-[10px] font-black uppercase tracking-tight">Home</span>
        </NavLink>
        
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 transition-all ${isCategoriesActive ? 'text-[#2874f0] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {/* Dynamic Category Grid Icon */}
          <div className={`grid grid-cols-2 gap-0.5 w-5 h-5 p-0.5 rounded-sm border transition-colors ${isCategoriesActive ? 'border-[#2874f0] bg-blue-50' : 'border-gray-300'}`}>
            {CATEGORIES.slice(0, 4).map(cat => (
              <span key={cat.id} className="text-[8px] leading-none flex items-center justify-center">
                {cat.icon}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tight">Categories</span>
        </button>

        <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all relative ${isActive ? 'text-[#2874f0] scale-110' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <ShoppingCart size={22} />
          <span className="text-[10px] font-black uppercase tracking-tight">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
              {cartCount}
            </span>
          )}
        </NavLink>

        <NavLink 
          to="/account" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#2874f0] scale-110' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <User size={22} />
          <span className="text-[10px] font-black uppercase tracking-tight">Account</span>
        </NavLink>
      </nav>

      {/* Categories Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[150] sm:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#2874f0]" />
                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Shop by Category</h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-white border rounded-full text-gray-400 hover:text-gray-600 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category List */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3 no-scrollbar pb-24">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-white shadow-sm transition-colors">
                      {cat.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{cat.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Latest Trends & Offers</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#2874f0] group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              <button 
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/categories');
                }}
                className="w-full py-4 text-center text-xs font-black text-[#2874f0] uppercase tracking-[0.2em] border-t border-dashed mt-4"
              >
                View Full Category Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
