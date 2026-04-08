
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import Home from './Home';
import ProductDetail from './ProductDetail';
import SearchResults from './SearchResults';
import SearchPage from './SearchPage';
import CategoriesPage from './CategoriesPage';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Signup from './Signup';
import OrderHistory from './OrderHistory';
import Compare from './Compare';
import Wishlist from './Wishlist';
import Notifications from './Notifications';
import Account from './Account';
import { CartItem, User, Order, Product } from './types';
import { CheckCircle, ShoppingCart, Heart, X } from 'lucide-react';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'cart' | 'wishlist' } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('shopswift_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error("Failed to load cart", e); }
    }
    const savedUser = localStorage.getItem('shopswift_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error("Failed to load user", e); }
    }
    const savedWishlist = localStorage.getItem('shopswift_wishlist');
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error("Failed to load wishlist", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopswift_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopswift_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopswift_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopswift_user');
    }
  }, [user]);

  const showToast = (message: string, type: 'cart' | 'wishlist' = 'cart') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (item: CartItem, silent: boolean = false) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
    if (!silent) {
      showToast(`${item.name} added to cart!`, 'cart');
    }
  };

  const clearCart = () => setCart([]);

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddOrder = (order: Order) => {
    if (user) {
      setUser({
        ...user,
        orders: [order, ...(user.orders || [])]
      });
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(productId);
      if (!isRemoving) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) showToast(`${product.name} added to wishlist!`, 'wishlist');
      }
      return isRemoving 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
    });
  };

  const toggleComparison = (product: Product) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeProductFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
  };

  const cartTotalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header 
          cartCount={cartTotalQuantity} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 pb-16 sm:pb-0">
          <Routes>
            <Route path="/" element={<Home wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />} />
            <Route path="/product/:id" element={
              <ProductDetail 
                onAddToCart={addToCart} 
                toggleComparison={toggleComparison}
                comparisonList={comparisonList}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            } />
            <Route path="/search" element={<SearchResults wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />} />
            <Route path="/search-interface" element={<SearchPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} user={user} onOrderSuccess={handleAddOrder} />} />
            <Route path="/compare" element={<Compare comparisonList={comparisonList} onRemove={removeProductFromComparison} />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onSignup={setUser} />} />
            <Route path="/orders" element={user ? <OrderHistory orders={user.orders} wishlist={wishlist} onAddToCart={addToCart} /> : <Navigate to="/login" />} />
            <Route path="/order-success" element={
              <div className="max-w-2xl mx-auto py-10 sm:py-20 px-4 text-center bg-white border rounded shadow-sm mt-10">
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-10 text-lg">Thank you for shopping with ShopSwift. Your order is being processed.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/" className="bg-[#2874f0] text-white px-10 py-3 rounded font-bold shadow hover:bg-blue-600 transition-colors">Continue Shopping</Link>
                  <Link to="/orders" className="border border-[#2874f0] text-[#2874f0] px-10 py-3 rounded font-bold hover:bg-blue-50 transition-colors text-center">View Order Status</Link>
                </div>
              </div>
            } />
            <Route path="/account" element={<Account user={user} onLogout={handleLogout} />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>

        <MobileNav cartCount={cartTotalQuantity} />

        {notification && (
          <div className="fixed bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 border border-white/10 min-w-[320px]">
              <div className={`${notification.type === 'wishlist' ? 'bg-red-500' : 'bg-green-500'} p-2 rounded-full`}>
                {notification.type === 'wishlist' ? <Heart size={18} className="text-white" fill="currentColor" /> : <ShoppingCart size={18} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Success!</p>
                <p className="text-xs text-gray-300 line-clamp-1">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
