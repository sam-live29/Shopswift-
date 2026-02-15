import React, { useState } from 'react';
import { Bell, Package, Tag, Info, ChevronRight, CheckCircle2, Trash2, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  type: 'order' | 'offer' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  image?: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered!',
    message: 'Your order OD123456789 has been delivered. We hope you love your new purchase!',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    type: 'offer',
    title: 'Price Drop Alert!',
    message: 'An item in your wishlist is now at its lowest price ever. Grab it before it sells out!',
    time: '5 hours ago',
    isRead: false,
    image: 'https://picsum.photos/seed/offer1/100/100'
  },
  {
    id: '3',
    type: 'info',
    title: 'Security Update',
    message: 'Your password was successfully changed. If this wasn\'t you, please contact support immediately.',
    time: '1 day ago',
    isRead: true
  },
  {
    id: '4',
    type: 'offer',
    title: 'Exclusive: 15% Off for You',
    message: 'Apply code SWIFT15 at checkout for an extra discount on fashion essentials.',
    time: '2 days ago',
    isRead: true
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Shipped',
    message: 'Great news! Your package is on the way and should reach you by Friday.',
    time: '3 days ago',
    isRead: true
  }
];

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'offers'>('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'orders') return n.type === 'order';
    if (activeTab === 'offers') return n.type === 'offer';
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="text-blue-600" size={20} />;
      case 'offer': return <Tag className="text-green-600" size={20} />;
      default: return <Info className="text-orange-500" size={20} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <Bell className="text-[#2874f0]" /> Notifications
        </h1>
        <button 
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
          className="text-xs font-bold text-[#2874f0] uppercase tracking-wider hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 bg-white rounded-t-lg shadow-sm overflow-hidden">
        {(['all', 'orders', 'offers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'text-[#2874f0] border-b-2 border-[#2874f0] bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`group bg-white border rounded-lg p-4 flex gap-4 transition-all cursor-pointer relative ${
                !notification.isRead ? 'border-l-4 border-l-[#2874f0] shadow-md' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === 'order' ? 'bg-blue-50' : 
                notification.type === 'offer' ? 'bg-green-50' : 'bg-orange-50'
              }`}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold truncate pr-6 ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{notification.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                  {notification.message}
                </p>
                {notification.image && (
                  <div className="w-16 h-16 rounded border mb-2 overflow-hidden">
                    <img src={notification.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {!notification.isRead && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2874f0] uppercase tracking-tighter">
                    <CheckCircle2 size={10} /> New Update
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => deleteNotification(e, notification.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="flex items-center self-center text-gray-300">
                <ChevronRight size={18} />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border rounded-lg py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BellOff className="text-gray-200" size={40} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">No notifications here</h3>
            <p className="text-xs text-gray-500 px-10">We'll let you know when there's an update about your order or an exciting offer!</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 text-[#2874f0] font-bold text-sm uppercase tracking-wider hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;