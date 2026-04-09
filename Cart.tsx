import React, { useState, useEffect } from 'react';
import { CartItem } from './types';
import { Trash2, ShieldCheck, Info, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setIsUpdating(id);
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
    // Brief delay to simulate/allow visual transition
    setTimeout(() => setIsUpdating(null), 300);
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals dynamically based on actual item data
  const subtotal = cart.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.quantity, 0);
  const currentTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = subtotal - currentTotal;
  const delivery = currentTotal > 500 ? 0 : 40;
  const finalAmount = currentTotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-10 flex flex-col items-center justify-center min-h-[60vh] bg-white mt-4 border rounded shadow-sm animate-fade-in">
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
           <ShoppingBag size={64} className="text-[#2874f0]/20" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven't added anything to your cart yet. Explore our top categories and find something you love.</p>
        <Link to="/" className="bg-[#2874f0] text-white px-16 py-3 rounded shadow-lg hover:bg-blue-600 transition-all font-semibold active:scale-95">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      
      <div className="flex-1 bg-white border rounded shadow-sm h-max">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">My Cart ({cart.length})</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
             📍 <span>Deliver to: <b>Mumbai - 400001</b></span>
             <button className="text-[#2874f0] font-bold border px-3 py-1 rounded ml-2 text-xs hover:bg-blue-50 transition-colors">Change</button>
          </div>
        </div>
        
        <div className="divide-y">
          {cart.map(item => (
            <div key={item.id} className={`p-4 flex flex-col sm:flex-row gap-6 transition-opacity duration-300 ${isUpdating === item.id ? 'opacity-70' : 'opacity-100'}`}>
              <div className="w-full sm:w-24 shrink-0 flex flex-col items-center gap-4">
                <div className="relative h-24 w-24 p-1 border rounded bg-white flex items-center justify-center group overflow-hidden">
                   <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110" />
                   {isUpdating === item.id && (
                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <Loader2 size={20} className="text-[#2874f0] animate-spin" />
                     </div>
                   )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors active:scale-90"
                    disabled={item.quantity <= 1 || isUpdating === item.id}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm border rounded-lg py-1 bg-gray-50">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full font-bold hover:bg-gray-100 transition-colors active:scale-90"
                    disabled={isUpdating === item.id}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-gray-900 font-bold hover:text-[#2874f0] cursor-pointer transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">
                    Express <span className="text-green-600">Free Delivery</span>
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Seller: ShopSwift Retail</p>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className={`text-xl font-black text-gray-900 transition-all duration-300 ${isUpdating === item.id ? 'scale-110 text-[#2874f0]' : ''}`}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  {item.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{(item.oldPrice * item.quantity).toLocaleString()}</span>
                  )}
                  <span className="text-xs text-green-600 font-black uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded">
                    {item.discount} OFF
                  </span>
                </div>

                <div className="flex gap-8">
                  <button className="text-[11px] font-black text-gray-800 uppercase hover:text-[#2874f0] tracking-widest transition-colors">Save for later</button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] font-black text-gray-800 uppercase hover:text-red-500 flex items-center gap-1 tracking-widest transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex justify-end sticky bottom-0 bg-white border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-b-sm z-10">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-[#fb641b] text-white px-12 sm:px-20 py-3 rounded shadow-lg font-black text-sm sm:text-lg hover:bg-orange-600 transition-all uppercase tracking-widest active:scale-95"
          >
            Place Order
          </button>
        </div>
      </div>

      <div className="w-full lg:w-96 space-y-4">
        <div className="bg-white border rounded shadow-sm sticky top-20 overflow-hidden">
          <div className="p-4 border-b text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Price Details</div>
          <div className="p-5 space-y-5 text-sm">
            <div className="flex justify-between font-medium text-gray-700">
              <span>Price ({cart.length} items)</span>
              <span className={`transition-all ${isUpdating ? 'opacity-50 blur-[1px]' : ''}`}>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600 font-bold">
              <span>Discount</span>
              <span className={`transition-all ${isUpdating ? 'opacity-50 blur-[1px]' : ''}`}>- ₹{totalSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-700">
              <span>Delivery Charges</span>
              <span className={delivery === 0 ? 'text-green-600 font-black uppercase tracking-widest' : ''}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </span>
            </div>
            
            <div className="border-t border-dashed pt-5 flex justify-between text-xl font-black text-gray-900">
              <span>Total Amount</span>
              <span className={`transition-all duration-300 ${isUpdating ? 'scale-105 text-[#2874f0]' : ''}`}>
                ₹{finalAmount.toLocaleString()}
              </span>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 animate-pulse">
               <p className="text-green-700 font-black text-xs uppercase tracking-tight text-center">
                 🎉 You will save ₹{totalSavings.toLocaleString()} on this order
               </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t flex items-center gap-3">
             <Info size={16} className="text-[#2874f0]" />
             <p className="text-[10px] text-gray-500 font-medium leading-tight">
               Safe and Secure Payments. Easy returns. 100% Authentic products.
             </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest px-4 py-2">
          <ShieldCheck size={24} className="shrink-0 text-[#2874f0]" />
          <p>India's Most Trusted Shopping Hub</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;