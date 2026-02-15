
import React, { useState, useEffect } from 'react';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import BrandLogo from '../components/BrandLogo';
import { PRODUCTS, CATEGORIES } from '../constants';
import { 
  ChevronRight, ChevronLeft, TrendingUp, ShieldCheck, 
  Truck, RefreshCw, Star, CreditCard, ShoppingBag, 
  LayoutGrid, Sparkles, Zap, ArrowUpRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '../types';

interface HomeProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
}

const BANNERS = [
  {
    id: 1,
    image: "https://picsum.photos/seed/bigbillion/1200/400",
    title: "Big Billion Days",
    subtitle: "India's Greatest Sale is Here!",
    color: "from-blue-900/80"
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/techsale/1200/400",
    title: "Future of Tech",
    subtitle: "Up to 40% Off on Latest Gadgets",
    color: "from-purple-900/80"
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/fashionshow/1200/400",
    title: "Styles for You",
    subtitle: "Brand New Winter Collection 2024",
    color: "from-rose-900/80"
  }
];

const ProductSection: React.FC<{ 
  title: string, 
  products: Product[], 
  categoryPath: string,
  wishlist: string[],
  onToggleWishlist: (id: string) => void,
  onAddToCart: (item: CartItem) => void
}> = ({ title, products, categoryPath, wishlist, onToggleWishlist, onAddToCart }) => (
  <section className="bg-white p-3 sm:p-6 rounded shadow-sm border mb-4 sm:mb-6 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 sm:pb-4 border-b">
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">Extra discounts for Plus members ✦</p>
      </div>
      <Link 
        to={`/search?category=${categoryPath}`} 
        className="bg-[#2874f0] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-sm hover:bg-blue-600 transition-all font-bold text-[10px] sm:text-xs uppercase shadow-sm flex items-center gap-1"
      >
        View All <ChevronRight size={14} />
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
      {products.slice(0, 6).map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isWishlisted={wishlist.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  </section>
);

const Home: React.FC<HomeProps> = ({ wishlist, onToggleWishlist, onAddToCart }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const electronics = PRODUCTS.filter(p => p.category === 'electronics').slice(0, 6);
  const mobiles = PRODUCTS.filter(p => p.category === 'mobiles').slice(0, 6);
  
  return (
    <div className="pb-20 sm:pb-10 bg-gray-100">
      <CategoryBar />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Dynamic Hero Slider */}
        <div className="relative rounded-lg overflow-hidden mb-6 h-48 sm:h-72 lg:h-96 shadow-lg group">
          <div 
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {BANNERS.map((banner) => (
              <div key={banner.id} className="min-w-full h-full relative">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} to-transparent flex flex-col justify-center px-8 sm:px-16 text-white`}>
                  <div className="bg-yellow-400 text-black text-[10px] sm:text-xs font-bold px-3 py-1 rounded w-max mb-3 uppercase tracking-widest shadow-lg">
                    HOT DEAL
                  </div>
                  <h1 className="text-2xl sm:text-6xl font-black mb-2 tracking-tight drop-shadow-md">
                    {banner.title}
                  </h1>
                  <p className="text-sm sm:text-2xl mb-8 opacity-90 max-w-md font-medium leading-tight">
                    {banner.subtitle}
                  </p>
                  <button 
                    onClick={() => navigate('/search')}
                    className="bg-white text-black px-8 py-2 sm:px-12 sm:py-4 rounded font-black text-xs sm:text-sm w-max hover:bg-[#2874f0] hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${currentSlide === i ? 'bg-white w-6 sm:w-8 shadow-md' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>

        {/* Spotlight Categories Grid */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border mb-6 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#2874f0]" />
              <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-gray-800 italic">Shop By Department</h3>
            </div>
            <Link to="/categories" className="text-[10px] font-black text-[#2874f0] uppercase tracking-widest hover:underline flex items-center gap-1">
              Explore All <ArrowUpRight size={12} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/search?category=${cat.id}`)}
                className="group relative flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                  {cat.icon}
                </div>
                <p className="text-[10px] sm:text-[11px] font-black text-gray-800 uppercase tracking-tighter text-center line-clamp-1">
                  {cat.name}
                </p>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Upto 40% Off
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Why Shop With Us */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Truck className="text-blue-600" />, title: 'Free Delivery', desc: 'On orders over ₹500' },
            { icon: <ShieldCheck className="text-green-600" />, title: '100% Secure', desc: 'Secure payment gateway' },
            { icon: <RefreshCw className="text-orange-600" />, title: 'Easy Returns', desc: '7 days return policy' },
            { icon: <CreditCard className="text-purple-600" />, title: 'Best Prices', desc: 'Guaranteed low prices' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-gray-50 p-3 rounded-full">{item.icon}</div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight text-gray-800">{item.title}</p>
                <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <ProductSection 
          title="Best of Electronics" 
          products={electronics} 
          categoryPath="electronics"
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />

        {/* Promotional Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <Link to="/search?category=fashion" className="block relative h-48 sm:h-56 rounded-lg overflow-hidden group shadow-lg">
              <img src="https://picsum.photos/seed/fashion-ad/800/400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
                 <div className="text-white">
                    <h3 className="text-2xl sm:text-3xl font-black italic">Fashion Fest</h3>
                    <p className="text-sm sm:text-lg opacity-90 font-medium">Unmatched Styles, Unbeatable Prices</p>
                    <span className="mt-4 inline-block bg-white text-black px-6 py-2 text-xs font-black rounded uppercase tracking-widest shadow-xl">Shop Now</span>
                 </div>
              </div>
           </Link>
           <Link to="/search?category=home" className="block relative h-48 sm:h-56 rounded-lg overflow-hidden group shadow-lg">
              <img src="https://picsum.photos/seed/home-ad/800/400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
                 <div className="text-white">
                    <h3 className="text-2xl sm:text-3xl font-black italic">Home Makeover</h3>
                    <p className="text-sm sm:text-lg opacity-90 font-medium">Up to 70% Off on Premium Furniture</p>
                    <span className="mt-4 inline-block bg-white text-black px-6 py-2 text-xs font-black rounded uppercase tracking-widest shadow-xl">Explore</span>
                 </div>
              </div>
           </Link>
        </div>

        <ProductSection 
          title="Top Mobile Picks" 
          products={mobiles} 
          categoryPath="mobiles"
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />

        {/* Enhanced Brand Focus Section */}
        <div className="bg-white p-4 sm:p-8 rounded shadow-sm border mb-10">
           <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                <TrendingUp size={24} className="text-[#2874f0]" /> Top Brand Stores
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Direct Partners</p>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
              {['Apple', 'Samsung', 'Sony', 'Nike', 'LG', 'LEGO'].map(brand => (
                <div 
                  key={brand} 
                  onClick={() => navigate(`/search?q=${brand}`)} 
                  className="border-2 border-transparent hover:border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-2xl cursor-pointer group transition-all bg-gray-50/50 hover:bg-white"
                >
                   <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <BrandLogo brand={brand} size="lg" />
                   </div>
                   <div className="mt-2 flex flex-col items-center">
                     <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter group-hover:text-blue-600">Explore Store</span>
                     <ChevronRight size={12} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Footer Info */}
        <div className="border-t py-12 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <ShoppingBag className="text-[#2874f0]" />
            <span className="text-xl font-black italic">ShopSwift Plus ✦</span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Experience the future of shopping with India's most trusted platform. Enjoy exclusive early access to sales, free shipping, and premium support with every purchase.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link to="/legal" className="hover:text-gray-800">Privacy Policy</Link>
            <Link to="/legal" className="hover:text-gray-800">Terms of Use</Link>
            <Link to="/help" className="hover:text-gray-800">Help Center</Link>
            <Link to="/seller" className="hover:text-gray-800">Sell on ShopSwift</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
