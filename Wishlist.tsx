
import React from 'react';
import { Product, CartItem } from './types';
import { PRODUCTS } from './constants';
import ProductCard from './ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WishlistProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlist, onToggleWishlist, onAddToCart }) => {
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Heart className="text-red-500" fill="currentColor" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist ({wishlistedProducts.length})</h1>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="animate-in fade-in zoom-in duration-300">
              <ProductCard 
                product={product}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded shadow-sm py-24 text-center">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Your wishlist is empty!</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Explore more and shortlist some items to see them here.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#2874f0] text-white px-10 py-3 rounded font-bold shadow-lg hover:bg-blue-600 transition-all hover:-translate-y-1 active:scale-95"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
