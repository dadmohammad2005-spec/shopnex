import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-950 text-slate-100 py-16 px-4 transition-colors">
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-sm">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
          The page or product you requested may have moved, been discontinued, or does not exist.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            to="/shop"
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
