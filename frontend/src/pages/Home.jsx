import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import DealsSection from '../components/home/DealsSection';
import Testimonials from '../components/home/Testimonials';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { productService } from '../services/api';
import { useStore } from '../context/StoreContext';

const Home = () => {
  const { siteName } = useStore();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ page_size: 20 }),
        ]);
        setCategories(catRes.data || []);
        setProducts(prodRes.data?.results || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Categories Grid */}
      <CategoryGrid categories={categories} loading={loading} />

      {/* 3. Featured Products */}
      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Handpicked Essentials
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Highlights
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
            >
              See All Featured <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : (featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Deals & Special Offers */}
      <DealsSection products={products} />

      {/* 5. Best Sellers */}
      <section className="py-16 sm:py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Award className="w-3.5 h-3.5" /> Customer Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Best-Selling Masterpieces
              </h2>
            </div>
            <Link
              to="/shop?bestsellers=true"
              className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
            >
              View Best Sellers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : (bestSellers.length > 0 ? bestSellers : products.slice(4, 8)).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 6. Promotional Banner Strip */}
      <section className="py-12 bg-gradient-to-r from-brand-950 via-indigo-950 to-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                Member Privilege
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-1 text-white">
                Join {siteName} Premier & Enjoy 10% Off Your Initial Order
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Use code <span className="font-bold underline decoration-amber-400 text-white">WELCOME10</span> at checkout for instant savings.
              </p>
            </div>
            <Link
              to="/shop"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition-all shrink-0"
            >
              Start Shopping Now
            </Link>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="py-16 sm:py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Fresh Additions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?new_arrivals=true"
              className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
            >
              Explore New Releases <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : (newArrivals.length > 0 ? newArrivals : products.slice(8, 12)).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 8. Client Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;
