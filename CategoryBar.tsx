
import React from 'react';
import { CATEGORIES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Shirt, Monitor, Home as HomeIcon, 
  Refrigerator, Sparkles, Gamepad2, ChevronRight, Zap 
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  mobiles: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
  fashion: <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />,
  electronics: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />,
  home: <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  appliances: <Refrigerator className="w-5 h-5 sm:w-6 sm:h-6" />,
  beauty: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  toys: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const categoryTheme: Record<string, { bg: string, text: string, border: string }> = {
  mobiles: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  fashion: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  electronics: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  home: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  appliances: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100' },
  beauty: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  toys: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
};

const CategoryBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm mb-4 border-b overflow-x-auto no-scrollbar scroll-smooth">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4 gap-4 sm:gap-8 min-w-max">
        {CATEGORIES.map((cat) => {
          const theme = categoryTheme[cat.id] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
          const isHot = cat.id === 'mobiles' || cat.id === 'fashion';

          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/search?category=${cat.id}`)}
              className="flex flex-col items-center group cursor-pointer w-20 sm:w-24 relative"
            >
              {isHot && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white items-center justify-center">
                    <Zap size={8} fill="white" className="text-white" />
                  </span>
                </span>
              )}
              
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:border-transparent group-hover:bg-[#2874f0] group-hover:text-white shadow-sm`}>
                {categoryIcons[cat.id] || <span>{cat.icon}</span>}
              </div>
              
              <span className="text-[10px] sm:text-xs font-black text-gray-700 group-hover:text-[#2874f0] uppercase tracking-tighter text-center whitespace-nowrap transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
        
        {/* All Categories Trigger */}
        <button
          onClick={() => navigate('/categories')}
          className="flex flex-col items-center group cursor-pointer w-20 sm:w-24 border-l pl-4 sm:pl-8 border-gray-100"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 text-gray-400 border border-gray-100 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white shadow-sm">
            <ChevronRight className="w-6 h-6" />
          </div>
          <span className="text-[10px] sm:text-xs font-black text-gray-400 group-hover:text-gray-900 uppercase tracking-tighter text-center transition-colors">
            All Stores
          </span>
        </button>
      </div>
    </div>
  );
};

export default CategoryBar;
