import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-16 lg:py-20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Promotional Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/80 border border-brand-800 text-brand-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Autumn 2026 Collection • Limited Production</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Precision Crafted. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-400">
                Effortlessly Premium.
              </span>
            </h1>

            {/* Sub-headline description */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Explore our hand-selected catalog of audiophile wireless electronics, Italian tailored apparel, ergonomic living essentials, and endurance gear.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-premium hover:shadow-premium-hover flex items-center justify-center gap-2 transition-all"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?deals=true"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 text-sm font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                Explore Deals
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800 w-full max-w-lg">
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400 font-medium">Authenticity Guarantee</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">40k+</div>
                <div className="text-xs text-slate-400 font-medium">Global Clients</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">4.9/5</div>
                <div className="text-xs text-slate-400 font-medium">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
                  alt="AeroSound Pro Wireless ANC Headphones"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Overlaid Product Highlight Box */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Featured Innovation</span>
                      <h3 className="text-sm font-bold text-white">AeroSound Pro ANC</h3>
                      <p className="text-xs text-slate-400 font-medium">Spatial audio & 40h playtime</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-white">$249.00</div>
                      <div className="text-xs text-slate-500 line-through">$299.00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl hidden sm:flex items-center gap-2.5 animate-bounce">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Flash Promo</div>
                  <div className="text-[11px] text-slate-400">Save up to 30% today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
