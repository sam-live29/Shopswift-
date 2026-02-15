
import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded border p-3 sm:p-4 h-full flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-gray-200 rounded-sm mb-4 w-full" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export const FilterSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
};
