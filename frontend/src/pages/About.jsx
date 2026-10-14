import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Globe, ArrowRight, HeartHandshake } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const About = () => {
  const { siteName } = useStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
            Our Story & Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Redefining Contemporary E-Commerce Excellence
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {siteName} was founded on a simple conviction: luxury design, cutting-edge technology, and ethical craftsmanship should be universally accessible without compromise.
          </p>
        </div>

        {/* Brand Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl text-center">
            <div className="w-14 h-14 bg-brand-950/80 border border-brand-800/80 text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Artisan Curation</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every item in our collection is strictly vetted for acoustic performance, fabric provenance, and ergonomic longevity.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl text-center">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Authenticity & Standards</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We partner directly with certified workshops across North America, Europe, and Japan to guarantee genuine products and fair wages.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl text-center">
            <div className="w-14 h-14 bg-amber-950/80 border border-amber-800/80 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Global Concierge</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Serving patrons across 60+ countries with localized customs handling, express air freight, and 24/7 dedicated support.
            </p>
          </div>
        </div>

        {/* Narrative Split */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
                The {siteName} Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Designed for Those Who Notice the Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                From the balanced acoustic resonance of our beryllium headphones to the vegetable-tanned patina of Tuscan leather, true luxury resides in the unseen subtleties.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Our team of industrial designers and material scientists tests every product through thousands of cycles, ensuring that what you welcome into your home endures for years.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-brand-900/40 transition-all"
              >
                Explore Current Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 border border-slate-700/60 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt={`${siteName} Creative Team`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
