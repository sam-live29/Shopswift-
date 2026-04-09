
import React, { useState } from 'react';
import { Order, CartItem } from './types';
import { PRODUCTS } from './constants';
import { ChevronRight, Search, Filter, Info, Package, ChevronDown, ChevronUp, PackageX, Truck, CheckCircle2, MapPin, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface OrderHistoryProps {
  orders: Order[];
  wishlist?: string[];
  onAddToCart?: (item: CartItem) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, wishlist = [], onAddToCart }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id)).slice(0, 4);

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600';
      case 'Shipped': return 'text-blue-600';
      case 'Processing': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const TrackingStepper = ({ status }: { status: string }) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status);
    
    return (
      <div className="mt-6 mb-8 relative">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 z-0"></div>
        <div 
          className="absolute top-4 left-0 h-0.5 bg-blue-500 z-0 transition-all duration-1000" 
          style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                idx <= currentIdx ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : 'bg-white border-gray-200 text-gray-300'
              }`}>
                {idx < currentIdx ? <CheckCircle2 size={16} /> : (idx === currentIdx ? <Package size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-200" />)}
              </div>
              <span className={`mt-2 text-[9px] font-black uppercase tracking-widest ${idx <= currentIdx ? 'text-blue-600' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 pb-24 sm:pb-10">
      <aside className="hidden md:block w-72 shrink-0 h-max sticky top-20">
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
            <h2 className="font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <Filter size={18} className="text-blue-600" /> Filter Orders
            </h2>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Clear</button>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">Order Status</h3>
              <div className="space-y-2">
                {['Delivered', 'On the way', 'Cancelled', 'Returned'].map(status => (
                  <label key={status} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-0" />
                    <span className="group-hover:text-blue-600 transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <Link to="/wishlist" className="flex items-center justify-between p-4 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition-colors group">
              <div className="flex items-center gap-3">
                <Heart size={20} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-widest">My Wishlist</span>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sidebar Wishlist Preview as part of "Wish list in the order" requirement */}
        {wishlistedProducts.length > 0 && (
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-yellow-500" />
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Buy Next?</h3>
            </div>
            <div className="space-y-4">
              {wishlistedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="flex gap-3 group">
                  <div className="w-12 h-12 bg-gray-50 border rounded p-1 shrink-0">
                    <img src={p.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-800 truncate group-hover:text-blue-600">{p.name}</p>
                    <p className="text-[10px] font-black text-blue-600">₹{p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1">
        <div className="bg-white border rounded-xl shadow-sm p-3 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <input 
              type="text" 
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            <Search className="absolute left-3 text-gray-400" size={18} />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md active:scale-95 transition-all">
            Find
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border rounded-xl shadow-sm overflow-hidden group/order">
                <div 
                  className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-colors ${expandedOrder === order.id ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex gap-5">
                    <div className="bg-white border rounded-lg p-3 shrink-0 shadow-sm relative overflow-hidden">
                       <Package className="text-blue-600 relative z-10" size={32} />
                       <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">ID: {order.id}</p>
                      <p className="text-sm font-bold text-gray-800">{order.items.length} Product{order.items.length > 1 ? 's' : ''}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">Ordered on {order.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:items-center">
                    <p className="text-lg font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className={`flex flex-col items-end`}>
                      <span className={`text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>{order.status}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Updated: Today</p>
                    </div>
                    {expandedOrder === order.id ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-gray-300" />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t p-6 animate-in slide-in-from-top-2 duration-300">
                    <TrackingStepper status={order.status} />
                    
                    <div className="bg-gray-50/50 rounded-xl p-5 mb-6 border border-dashed border-gray-200">
                      <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <MapPin size={12} className="text-red-500" /> Shipping Address
                      </div>
                      <p className="text-xs text-gray-700 font-bold mb-1">Default Address (Home)</p>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-sm">Flat No 101, Blue Heaven Apartments, SV Road, Andheri West, Mumbai, Maharashtra - 400058</p>
                    </div>

                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Item Details</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border group/item hover:border-blue-100 transition-colors">
                          <img src={item.image} onClick={() => navigate(`/product/${item.id}`)} className="w-14 h-14 object-contain border rounded-lg bg-gray-50 cursor-pointer" alt="" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{item.price.toLocaleString()}</p>
                          </div>
                          <button onClick={() => navigate(`/product/${item.id}`)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
                             <ChevronRight size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white border rounded-2xl shadow-sm py-20 text-center px-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageX size={48} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">No orders yet</h3>
              <p className="text-sm text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">It seems like you haven't placed any orders yet. Start your shopping journey today!</p>
              <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3 mx-auto">
                <ShoppingBag size={18} /> Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
