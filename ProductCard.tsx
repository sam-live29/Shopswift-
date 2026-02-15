import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { Star, Heart, ShoppingCart, Zap, AlertCircle, CheckCircle2, PackageX, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onAddToCart?: (item: CartItem, silent?: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted = false, onToggleWishlist, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } 
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      setIsWishlistAnimating(true);
      onToggleWishlist(product.id);
      setTimeout(() => setIsWishlistAnimating(false), 400);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && onAddToCart) {
      onAddToCart({ ...product, quantity: 1 });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && onAddToCart) {
      setIsBuying(true);
      onAddToCart({ ...product, quantity: 1 }, true);
      // Subtle delay to provide visual feedback before redirecting to checkout
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'text-red-500', icon: <PackageX size={12} /> };
    if (product.stock < 10) return { label: `Hurry, Only ${product.stock} left`, color: 'text-orange-600', icon: <AlertCircle size={12} /> };
    return { label: 'In Stock', color: 'text-green-600', icon: <CheckCircle2 size={12} /> };
  };

  const stockInfo = getStockStatus();

  return (
    <Link 
      ref={cardRef}
      to={`/product/${product.id}`}
      className={`bg-white rounded overflow-hidden hover:shadow-xl transition-shadow border group relative p-3 sm:p-4 h-full flex flex-col ${product.stock === 0 ? 'opacity-80' : ''}`}
      aria-label={`View details for ${product.name}, price ₹${product.price.toLocaleString()}`}
    >
      {/* Wishlist Heart Icon Button */}
      <button 
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 transition-all duration-300 z-20 transform p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-gray-100 ${
          isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
        } ${isWishlistAnimating ? 'scale-125' : 'hover:scale-110 active:scale-90'}`}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      >
        <Heart 
          size={18} 
          fill={isWishlisted ? "currentColor" : "none"} 
          className={`transition-all duration-300 ${isWishlistAnimating ? 'animate-ping' : ''}`} 
        />
        <Heart 
          size={18} 
          fill={isWishlisted ? "currentColor" : "none"} 
          className="absolute inset-0 m-auto" 
        />
      </button>
      
      <div className="aspect-[4/5] relative mb-4 overflow-hidden rounded-sm bg-gray-50 flex items-center justify-center group" aria-hidden="true">
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer-effect z-[5]">
             <div className="w-full h-full flex items-center justify-center opacity-10">
                <ShoppingCart size={32} className="text-gray-400" />
             </div>
          </div>
        )}
        
        {isInView && (
          <img 
            src={product.image} 
            alt={product.name} 
            onLoad={() => setImageLoaded(true)}
            className={`object-contain w-full h-full transform transition-all duration-700 ease-out group-hover:scale-110 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${product.stock === 0 ? 'grayscale contrast-75' : ''}`}
          />
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Sold Out</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-[#2874f0]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center bg-green-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.rating} <Star size={9} className="ml-0.5" fill="white" />
          </div>
          <span className="text-gray-400 text-[10px] font-medium">
            ({product.reviewsCount.toLocaleString()})
          </span>
          {product.isAssured && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 rounded-full border border-blue-100">
               <ShieldCheck size={10} className="text-blue-600" />
               <span className="text-[9px] font-bold text-blue-700 uppercase tracking-tighter">Verified</span>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">₹{product.oldPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className={`flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-tight ${stockInfo.color}`}>
            {stockInfo.icon}
            <span>{stockInfo.label}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-1.5 sm:gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isBuying}
            aria-label={isAdded ? `Successfully added ${product.name} to cart` : `Add ${product.name} to cart`}
            className={`py-1.5 sm:py-2 rounded shadow-sm font-bold text-[9px] sm:text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95 uppercase whitespace-nowrap overflow-hidden ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' 
                : isAdded 
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-[#ff9f00] text-white hover:bg-[#f39700]'
            }`}
          >
            {isAdded ? (
              <span className="flex items-center gap-1 animate-fade-in">
                <Check size={12} strokeWidth={3} /> Added
              </span>
            ) : (
              <>
                <ShoppingCart size={12} /> Cart
              </>
            )}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={product.stock === 0 || isBuying}
            aria-label={`Buy ${product.name} now`}
            className={`py-1.5 sm:py-2 rounded shadow-sm font-bold text-[9px] sm:text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95 uppercase whitespace-nowrap ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' 
                : isBuying
                  ? 'bg-[#fb641b] text-white border-none cursor-default'
                  : 'bg-[#fb641b] text-white hover:bg-[#ef5d13]'
            }`}
          >
            {isBuying ? (
              <span className="flex items-center gap-1 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Next...
              </span>
            ) : (
              <>
                <Zap size={12} fill={product.stock === 0 ? "none" : "white"} /> Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;