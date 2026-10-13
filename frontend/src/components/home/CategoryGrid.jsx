import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryGrid = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-slate-800 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square bg-slate-900 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-950 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1 block">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
          >
            Browse All Categories <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-end p-4 sm:p-5"
            >
              {/* Background Photography */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

              {/* Text Information */}
              <div className="relative z-10 text-white">
                <span className="text-[11px] font-medium text-slate-300 block mb-0.5">
                  {cat.product_count} {cat.product_count === 1 ? 'Product' : 'Products'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
