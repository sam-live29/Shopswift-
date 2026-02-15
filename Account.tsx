import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, Heart, MapPin, CreditCard, Settings, HelpCircle, 
  ChevronRight, LogOut, Wallet, User as UserIcon, ShieldCheck, 
  Bell, Ticket, Gift, Headphones, MessageSquare, Star
} from 'lucide-react';
import { User } from '../types';

interface AccountProps {
  user: User | null;
  onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserIcon size={40} className="text-[#2874f0]" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-tight">Your Profile</h2>
        <p className="text-gray-500 mb-10 text-sm">Log in to view your orders, addresses, and personalized offers.</p>
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-[#2874f0] text-white py-4 rounded font-bold uppercase shadow-lg active:scale-95 transition-all"
        >
          Login / Signup
        </button>
      </div>
    );
  }

  const sections = [
    { 
      id: 'orders', 
      label: 'My Orders', 
      icon: <Package className="text-blue-600" />, 
      path: '/orders',
      count: user.orders?.length || 0 
    },
    { 
      id: 'wishlist', 
      label: 'Wishlist', 
      icon: <Heart className="text-red-500" />, 
      path: '/wishlist' 
    },
    { 
      id: 'coupons', 
      label: 'Coupons', 
      icon: <Ticket className="text-orange-500" />, 
      path: '/coupons' 
    },
    { 
      id: 'help', 
      label: 'Help Center', 
      icon: <Headphones className="text-purple-600" />, 
      path: '/help' 
    }
  ];

  const subSections = [
    {
      title: 'Account Settings',
      items: [
        { label: 'Edit Profile', icon: <UserIcon size={18} />, path: '/profile/edit' },
        { label: 'Saved Addresses', icon: <MapPin size={18} />, path: '/addresses' },
        { label: 'Saved Cards & Wallet', icon: <CreditCard size={18} />, path: '/payments' },
        { label: 'Notifications Settings', icon: <Bell size={18} />, path: '/notifications-settings' }
      ]
    },
    {
      title: 'Feedback & Support',
      items: [
        { label: '24x7 Customer Support', icon: <MessageSquare size={18} />, path: '/support' },
        { label: 'Legal & Privacy', icon: <ShieldCheck size={18} />, path: '/legal' },
        { label: 'Rate our App', icon: <Star size={18} />, path: '/rate' }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-10">
      {/* Profile Header */}
      <div className="bg-[#2874f0] p-6 text-white sm:rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-white/20">
            <UserIcon size={32} className="text-[#2874f0]" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase tracking-tight">{user.name}</h1>
            <p className="text-xs text-blue-100 font-medium">{user.email}</p>
          </div>
          <button className="bg-white/20 p-2 rounded-full border border-white/20">
            <Settings size={18} />
          </button>
        </div>
        
        <div className="mt-8 flex gap-3 relative z-10">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
               <Wallet size={14} className="text-yellow-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Plus Wallet</span>
            </div>
            <p className="text-lg font-black">₹0.00</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
               <Gift size={14} className="text-yellow-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">SuperCoins</span>
            </div>
            <p className="text-lg font-black">450 <span className="text-[10px] text-yellow-400">★</span></p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-20">
        {/* Main Action Grid */}
        <div className="bg-white rounded-xl shadow-xl border grid grid-cols-2 divide-x divide-y overflow-hidden">
          {sections.map(section => (
            <Link 
              key={section.id}
              to={section.path}
              className="p-5 flex flex-col items-center gap-2 hover:bg-gray-50 active:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1">
                {section.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-700">{section.label}</span>
              {section.count !== undefined && (
                <span className="text-[10px] font-bold text-[#2874f0]">{section.count} items</span>
              )}
            </Link>
          ))}
        </div>

        {/* Detailed Menus */}
        <div className="mt-6 space-y-6">
          {subSections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 mb-3">
                {section.title}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden divide-y">
                {section.items.map((item, i) => (
                  <Link 
                    key={i}
                    to={item.path}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 group-hover:text-[#2874f0] transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full mt-8 bg-white border-2 border-red-50 text-red-600 py-4 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-red-50 transition-colors mb-10 shadow-sm"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Account;