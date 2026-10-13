import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden p-4 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square bg-slate-800 rounded-xl mb-4"></div>
        <div className="h-3 bg-slate-800 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-800 rounded w-4/5 mb-3"></div>
        <div className="h-3 bg-slate-800 rounded w-1/2 mb-4"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-800 rounded w-1/4"></div>
        <div className="h-9 bg-slate-800 rounded-xl w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
