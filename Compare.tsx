
import React from 'react';
import { Product } from '../types';
import { Star, X, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CompareProps {
  comparisonList: Product[];
  onRemove: (id: string) => void;
}

const Compare: React.FC<CompareProps> = ({ comparisonList, onRemove }) => {
  const navigate = useNavigate();

  if (comparisonList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center bg-white border rounded shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-4">No products to compare</h2>
        <p className="text-gray-500 mb-8">Add at least two products to start comparing them.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#2874f0] text-white px-10 py-3 rounded font-bold hover:bg-blue-600 transition-colors"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  // Get all unique specification keys
  // Fix: Explicitly type allSpecKeys as string[] to ensure 'key' is recognized as a string for indexing
  const allSpecKeys: string[] = Array.from(new Set(
    comparisonList.flatMap(p => Object.keys(p.specifications))
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Compare Products</h1>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-6 text-left text-gray-400 font-bold uppercase text-xs tracking-widest w-64 min-w-[200px] border-r">Details</th>
              {comparisonList.map(product => (
                <th key={product.id} className="p-6 min-w-[250px] border-r last:border-r-0 relative group">
                  <button 
                    onClick={() => onRemove(product.id)}
                    className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex flex-col items-center">
                    <img src={product.image} className="h-32 w-32 object-contain mb-4" alt="" />
                    <Link to={`/product/${product.id}`} className="text-sm font-bold text-gray-800 hover:text-[#2874f0] text-center mb-2 line-clamp-2">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {product.rating} <Star size={10} fill="white" className="ml-0.5" />
                      </div>
                      <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                    </div>
                    <p className="text-lg font-bold">₹{product.price.toLocaleString()}</p>
                    <button className="mt-4 bg-[#ff9f00] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#f39700] transition-colors flex items-center gap-2">
                      <ShoppingCart size={14} /> ADD TO CART
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td colSpan={comparisonList.length + 1} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-6">
                Specifications
              </td>
            </tr>
            {allSpecKeys.map(key => (
              <tr key={key} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-6 text-sm font-medium text-gray-500 border-r">{key}</td>
                {comparisonList.map(product => (
                  <td key={product.id} className="p-6 text-sm text-gray-800 border-r last:border-r-0">
                    {/* Accessing product specifications using string key to fix the index type error */}
                    {product.specifications[key] || <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan={comparisonList.length + 1} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-6">
                Brand Info
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-6 text-sm font-medium text-gray-500 border-r">Brand</td>
              {comparisonList.map(product => (
                <td key={product.id} className="p-6 text-sm text-gray-800 border-r last:border-r-0 font-bold">
                  {product.brand}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
         <button 
           onClick={() => navigate('/')}
           className="text-[#2874f0] font-bold hover:underline"
         >
           + Add more products to compare
         </button>
      </div>
    </div>
  );
};

export default Compare;
