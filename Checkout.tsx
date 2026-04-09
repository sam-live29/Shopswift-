
import React, { useState, useEffect } from 'react';
import { CartItem, User, Order } from './types';
import { CheckCircle, CreditCard, Truck, ShieldCheck, ArrowLeft, Smartphone, Wallet, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  user: User | null;
  onOrderSuccess: (order: Order) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, user, onOrderSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (user && step === 1) {
      setStep(2);
    }
  }, [user]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: 'OD' + Math.floor(Math.random() * 1000000000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...cart],
        total: total,
        status: 'Processing'
      };

      onOrderSuccess(newOrder);
      setIsProcessing(false);
      clearCart();
      navigate('/order-success');
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-4">
          
          <div className="bg-white border rounded shadow-sm">
            <div className={`p-4 flex items-center justify-between ${step > 1 ? 'bg-gray-50' : 'bg-[#2874f0] text-white'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step > 1 ? 'bg-white text-blue-600 border' : 'bg-white text-blue-600'}`}>1</span>
                <span className="uppercase font-bold tracking-wider">Login</span>
                {step > 1 && <CheckCircle size={16} className="text-blue-600 ml-2" />}
              </div>
              {step > 1 && !user && (
                <button onClick={() => setStep(1)} className="text-blue-600 border px-6 py-1.5 rounded bg-white font-bold text-xs uppercase">Change</button>
              )}
            </div>
            {step === 1 && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                     <p className="text-sm mb-6 text-gray-600">You are currently checking out as a guest.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                         onClick={() => setStep(2)}
                         className="bg-[#fb641b] text-white px-12 py-3 rounded font-bold uppercase text-sm shadow hover:bg-orange-600 transition-colors"
                       >
                         Continue as Guest
                       </button>
                       <button 
                         onClick={() => navigate('/login')}
                         className="border border-[#2874f0] text-[#2874f0] px-12 py-3 rounded font-bold uppercase text-sm hover:bg-blue-50 transition-colors"
                       >
                         Login / Signup
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            )}
            {step > 1 && user && (
               <div className="p-4 bg-gray-50 text-sm">
                 <p>Logged in as <b>{user.name}</b> ({user.email})</p>
               </div>
            )}
          </div>

          <div className="bg-white border rounded shadow-sm">
            <div className={`p-4 flex items-center justify-between ${step === 2 ? 'bg-[#2874f0] text-white' : 'bg-gray-50 text-gray-500'}`}>
               <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500'}`}>2</span>
                <span className="uppercase font-bold tracking-wider">Delivery Address</span>
                {step > 2 && <CheckCircle size={16} className="text-blue-600 ml-2" />}
              </div>
              {step > 2 && (
                <button onClick={() => setStep(2)} className="text-blue-600 border px-6 py-1.5 rounded bg-white font-bold text-xs uppercase">Change</button>
              )}
            </div>
            {step === 2 && (
              <div className="p-6">
                <div className="border border-[#2874f0] p-4 rounded bg-blue-50/30 mb-6">
                   <div className="flex items-center gap-3 mb-2">
                      <input type="radio" checked readOnly className="w-4 h-4 text-[#2874f0]" />
                      <span className="font-bold">{user ? user.name : 'Guest User'}</span>
                      <span className="bg-gray-200 text-[10px] px-2 py-0.5 rounded font-bold">HOME</span>
                      <span className="font-bold ml-2">9876543210</span>
                   </div>
                   <p className="text-sm ml-7 text-gray-700 leading-relaxed">
                     {user ? user.address : 'Flat No 101, Blue Heaven Apartments, SV Road, Andheri West, Mumbai, Maharashtra - 400058'}
                   </p>
                   <button 
                     onClick={() => setStep(3)}
                     className="ml-7 mt-6 bg-[#fb641b] text-white px-12 py-3 rounded font-bold uppercase text-sm shadow hover:bg-orange-600 transition-colors"
                   >
                     Deliver Here
                   </button>
                </div>
                <button className="text-[#2874f0] font-bold text-sm flex items-center gap-2 p-2">+ Add a new address</button>
              </div>
            )}
          </div>

          <div className="bg-white border rounded shadow-sm">
            <div className={`p-4 flex items-center justify-between ${step === 3 ? 'bg-[#2874f0] text-white' : 'bg-gray-50 text-gray-500'}`}>
               <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500'}`}>3</span>
                <span className="uppercase font-bold tracking-wider">Order Summary</span>
              </div>
            </div>
            {step === 3 && (
              <div className="p-4 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img src={item.image} className="h-16 w-16 object-contain" alt="" />
                    <div className="flex-1">
                       <p className="font-medium text-sm">{item.name}</p>
                       <p className="text-xs text-gray-500">Seller: RetailMaster</p>
                       <p className="font-bold mt-1">₹{item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end p-4">
                   <button 
                    onClick={() => setStep(4)}
                    className="bg-[#fb641b] text-white px-12 py-3 rounded font-bold uppercase text-sm shadow"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded shadow-sm">
             <div className={`p-4 flex items-center justify-between ${step === 4 ? 'bg-[#2874f0] text-white' : 'bg-gray-50 text-gray-500'}`}>
               <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step === 4 ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500'}`}>4</span>
                <span className="uppercase font-bold tracking-wider">Payment Options</span>
              </div>
            </div>
            {step === 4 && (
              <div className="p-6 space-y-6">
                <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" className="mt-1 w-4 h-4 text-[#2874f0]" defaultChecked />
                  <div className="flex-1">
                    <p className="font-bold flex items-center gap-2">
                       <Smartphone size={18} className="text-[#2874f0]" /> 
                       UPI (Google Pay, PhonePe, Paytm)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Fast and secure payments via your banking app.</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" className="mt-1 w-4 h-4 text-[#2874f0]" />
                  <div className="flex-1">
                    <p className="font-bold flex items-center gap-2">
                       <CreditCard size={18} className="text-[#2874f0]" />
                       Credit / Debit / ATM Card
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Mastercard, Visa, RuPay and more.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border rounded cursor-pointer hover:bg-gray-50">
                   <input type="radio" name="payment" className="mt-1 w-4 h-4 text-[#2874f0]" />
                   <div className="flex-1">
                      <p className="font-bold flex items-center gap-2">
                         <Landmark size={18} className="text-[#2874f0]" />
                         Net Banking
                      </p>
                      <p className="text-xs text-gray-500 mt-1">All major banks supported.</p>
                   </div>
                </label>

                <div className="bg-gray-100 p-4 rounded text-center">
                   <p className="text-sm font-bold mb-4">Total Amount: ₹{total.toLocaleString()}</p>
                   <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#fb641b] text-white py-4 rounded font-bold uppercase text-lg shadow hover:bg-orange-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-3"
                  >
                    {isProcessing ? 'Processing Order...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-96">
           <div className="bg-white border rounded shadow-sm sticky top-20">
              <div className="p-4 border-b font-bold text-gray-500 uppercase text-xs tracking-widest">Price Details</div>
              <div className="p-4 space-y-4">
                 <div className="flex justify-between text-sm">
                    <span>Price ({cart.length} items)</span>
                    <span>₹{total.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm text-green-600">
                    <span>Delivery Charges</span>
                    <span className="font-bold">FREE</span>
                 </div>
                 <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total Payable</span>
                    <span>₹{total.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
