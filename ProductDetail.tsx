
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Star, Shield, RefreshCw, ShoppingCart, Zap, Heart, Share2, Info, User as UserIcon, CheckCircle, ArrowRight, X, ShieldCheck, ChevronRight, Home } from 'lucide-react';
import { CartItem, Review, Product } from '../types';

interface ProductDetailProps {
  onAddToCart: (item: CartItem) => void;
  toggleComparison: (product: Product) => void;
  comparisonList: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart, toggleComparison, comparisonList, wishlist, onToggleWishlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const isComparing = comparisonList.some(p => p.id === id);
  const isWishlisted = id ? wishlist.includes(id) : false;

  useEffect(() => {
    if (id) {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('shopswift_reviews') || '[]');
      const productReviews = allReviews.filter(r => r.productId === id);
      setReviews(productReviews);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-[#2874f0]">Back to home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity: 1 });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    onAddToCart({ ...product, quantity: 1 });
    navigate('/checkout');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return alert('Please select a rating');

    const review: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userName: 'Guest User',
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const allReviews: Review[] = JSON.parse(localStorage.getItem('shopswift_reviews') || '[]');
    const updatedReviews = [review, ...allReviews];
    localStorage.setItem('shopswift_reviews', JSON.stringify(updatedReviews));
    
    setReviews([review, ...reviews]);
    setNewRating(0);
    setNewComment('');
    setShowReviewForm(false);
  };

  // Find category name for breadcrumb
  const categoryData = CATEGORIES.find(c => c.id === product.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 bg-white min-h-screen relative">
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-5/12">
          <div className="sticky top-20">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
                {[product.image, ...Array(3).fill(product.image)].map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-16 h-16 border p-1 rounded transition-all ${selectedImg === idx ? 'border-[#2874f0] ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="" />
                  </button>
                ))}
              </div>
              <div className="flex-1 relative aspect-square border p-4 bg-white">
                <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'}`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isComparing} 
                  onChange={() => toggleComparison(product)}
                  className="w-4 h-4 rounded text-[#2874f0]" 
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#2874f0]">Add to Compare</span>
              </label>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-[#fb641b] text-white py-3.5 sm:py-4 rounded shadow-md font-bold text-sm sm:text-lg flex items-center justify-center gap-2 hover:bg-[#ef5d13] transition-colors uppercase"
              >
                <Zap size={22} fill="white" /> BUY NOW
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#ff9f00] text-white py-3.5 sm:py-4 rounded shadow-md font-bold text-sm sm:text-lg flex items-center justify-center gap-2 hover:bg-[#f39700] transition-colors uppercase"
              >
                <ShoppingCart size={22} fill="white" /> ADD TO CART
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center flex-wrap gap-1 text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#2874f0] transition-colors flex items-center gap-1">
              <Home size={12} className="mb-0.5" /> Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link to={`/search?category=${product.category}`} className="hover:text-[#2874f0] transition-colors">
              {categoryData?.name || product.category}
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link to={`/search?category=${product.category}&subCategory=${encodeURIComponent(product.subCategory)}`} className="hover:text-[#2874f0] transition-colors">
              {product.subCategory}
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-400 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
          </nav>
          
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {product.rating} <Star size={12} fill="white" className="ml-1" />
            </div>
            <span className="text-gray-500 font-medium text-sm">
              {product.reviewsCount.toLocaleString()} Ratings & Reviews
            </span>
            {product.isAssured && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                 <ShieldCheck size={14} className="text-blue-600" />
                 <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Swift Verified</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-500 line-through font-medium">₹{product.oldPrice.toLocaleString()}</span>
                <span className="text-lg text-green-700 font-bold">{product.discount}</span>
              </>
            )}
            <Info size={16} className="text-gray-400 cursor-pointer" />
          </div>

          <div className="mt-4 border-t pt-6">
            <h3 className="font-bold text-sm uppercase text-gray-500 mb-4 tracking-wider">Available Offers</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="text-green-600 mt-0.5"><Zap size={14} /></div>
                  <div className="text-sm">
                    <span className="font-bold mr-2">Bank Offer</span>
                    10% instant discount on Partner Bank Credit Cards, up to ₹1000 on orders of ₹5,000 and above <a href="#" className="text-blue-600 font-bold ml-1">T&C</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border rounded-sm p-6 bg-gray-50/30">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800">Product Highlights</h3>
                <Share2 size={18} className="text-gray-400 cursor-pointer" />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex gap-4">
                     <span className="text-gray-500 text-sm w-24 flex-shrink-0">{key}</span>
                     <span className="text-gray-800 text-sm font-medium">{val}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="mt-8 border rounded-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-800">Ratings & Reviews</h3>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-white border text-gray-800 px-6 py-2 rounded-sm font-bold text-sm shadow-sm hover:bg-gray-50"
              >
                {showReviewForm ? 'Cancel' : 'Rate Product'}
              </button>
            </div>

            {showReviewForm && (
              <div className="p-6 bg-blue-50/30 border-b">
                <form onSubmit={submitReview}>
                  <p className="font-bold text-sm mb-4">Rate this product</p>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          fill={(hoverRating || newRating) >= star ? "#ff9f00" : "none"} 
                          className={(hoverRating || newRating) >= star ? "text-[#ff9f00]" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="font-bold text-sm mb-2">Review this product</p>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Description (Optional)"
                    className="w-full bg-white text-black border rounded-sm p-4 text-sm min-h-[120px] focus:outline-none focus:border-[#2874f0] mb-4"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-[#2874f0] text-white px-10 py-2.5 rounded-sm font-bold text-sm shadow hover:bg-blue-600 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="divide-y">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {review.rating} <Star size={10} fill="white" className="ml-1" />
                      </div>
                      <p className="font-bold text-sm text-gray-800">Certified Buyer Review</p>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-bold text-gray-700">{review.userName}</span>
                      <CheckCircle size={12} className="text-gray-400" />
                      <span>Certified Buyer</span>
                      <span className="ml-4">{review.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first one to review this product!</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 border rounded bg-blue-50/50 flex items-start gap-4">
            <Shield className="text-[#2874f0] shrink-0" size={24} />
            <div>
              <p className="font-bold text-sm">Authentic Product Guarantee</p>
              <p className="text-xs text-gray-600">Enjoy 100% genuine products directly from authorized sellers with easy tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {comparisonList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-[100] border-t py-4 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            {comparisonList.map(p => (
              <div key={p.id} className="relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 border rounded bg-white p-1">
                <img src={p.image} className="w-full h-full object-contain" alt="" />
                <button 
                  onClick={() => toggleComparison(p)}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 shadow hover:bg-black transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - comparisonList.length }).map((_, i) => (
              <div key={i} className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-300">
                <span className="text-xs font-bold text-center px-1">Add to Compare</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 ml-4">
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/compare')}
                disabled={comparisonList.length < 2}
                className="bg-[#2874f0] text-white px-6 py-2 sm:px-10 sm:py-3 rounded shadow hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold uppercase text-xs sm:text-sm"
              >
                Compare Now
              </button>
              <button 
                onClick={() => {
                  comparisonList.forEach(p => toggleComparison(p));
                }}
                className="text-xs font-bold text-[#2874f0] hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
