import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const DealsSection = ({ products = [] }) => {
  // 18-hour countdown simulator
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.has_discount).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5 fill-rose-500" /> Limited Time Flash Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exclusive Discounts of the Week
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Save up to 30% on top tier audio, designer apparel, and home essentials.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-2.5 sm:p-3 rounded-2xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-sans">Hours</span>
              </div>
              <span className="text-slate-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-sans">Mins</span>
              </div>
              <span className="text-slate-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-sans">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop?deals=true"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-brand-400 transition-colors"
          >
            View all flash discounts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
