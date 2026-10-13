import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { productService } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const orderingParam = searchParams.get('ordering') || '-created_at';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const inStockParam = searchParams.get('in_stock') === 'true';
  const dealsParam = searchParams.get('deals') === 'true';
  const featuredParam = searchParams.get('featured') === 'true';
  const newArrivalsParam = searchParams.get('new_arrivals') === 'true';
  const bestsellersParam = searchParams.get('bestsellers') === 'true';

  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    productService.getCategories().then((res) => {
      setCategories(res.data || []);
    }).catch(console.error);
  }, []);

  // Fetch Products based on current params
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 12,
        ordering: searchParams.get('ordering') || '-created_at',
      };

      if (categoryParam) params.category = categoryParam;
      if (searchParam) params.search = searchParam;
      if (minPriceParam) params.min_price = minPriceParam;
      if (maxPriceParam) params.max_price = maxPriceParam;
      if (inStockParam) params.in_stock = 'true';
      if (dealsParam) params.deals = 'true';
      if (featuredParam) params.featured = 'true';
      if (newArrivalsParam) params.new_arrivals = 'true';
      if (bestsellersParam) params.bestsellers = 'true';

      const response = await productService.getProducts(params);
      const results = response.data?.results || [];
      const count = response.data?.count || 0;

      setProducts(results);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / 12) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, categoryParam, searchParam, minPriceParam, maxPriceParam, inStockParam, dealsParam, featuredParam, newArrivalsParam, bestsellersParam]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Update URL Search Parameters
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('min_price', minPrice);
    else next.delete('min_price');

    if (maxPrice) next.set('max_price', maxPrice);
    else next.delete('max_price');

    setSearchParams(next);
  };

  const handleStockToggle = (e) => {
    const checked = e.target.checked;
    setInStockOnly(checked);
    updateParam('in_stock', checked ? 'true' : null);
  };

  const resetAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-200">Catalog</span>
            {categoryParam && (
              <>
                <span>/</span>
                <span className="text-brand-400 capitalize">{categoryParam.replace('-', ' ')}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {searchParam
                  ? `Search results for "${searchParam}"`
                  : categoryParam
                  ? categories.find((c) => c.slug === categoryParam)?.name || 'Curated Category'
                  : dealsParam
                  ? 'Special Offers & Promotions'
                  : 'All Premium Products'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Showing {products.length} of {totalCount} items
              </p>
            </div>

            {/* Mobile Filter Toggle & Desktop Sort Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold rounded-xl text-slate-200 shadow-sm hover:bg-slate-800"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={orderingParam}
                  onChange={(e) => updateParam('ordering', e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 text-slate-200 shadow-sm outline-none focus:border-brand-500"
                >
                  <option value="-created_at">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-400" /> Filters
              </span>
              <button
                onClick={resetAllFilters}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Category
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('category', null)}
                  className={`w-full text-left text-xs sm:text-sm py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                    !categoryParam ? 'bg-brand-950 text-brand-300 border border-brand-800/80 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('category', c.slug)}
                    className={`w-full text-left text-xs sm:text-sm py-1.5 px-2.5 rounded-lg font-medium flex items-center justify-between transition-colors ${
                      categoryParam === c.slug ? 'bg-brand-950 text-brand-300 border border-brand-800/80 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-slate-500">({c.product_count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Price Range ($)
              </h4>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                  <span className="text-slate-500 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Apply Filter
                </button>
              </form>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Availability
              </h4>
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={handleStockToggle}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-800"
                />
                In Stock Items Only
              </label>
            </div>

            {/* Special Collections */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Collection Type
              </h4>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => updateParam('deals', dealsParam ? null : 'true')}
                  className={`text-left py-1.5 px-2 rounded-lg font-medium transition-colors ${dealsParam ? 'bg-rose-950/80 text-rose-400 border border-rose-800 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  🔥 Special Deals & Discounts
                </button>
                <button
                  onClick={() => updateParam('featured', featuredParam ? null : 'true')}
                  className={`text-left py-1.5 px-2 rounded-lg font-medium transition-colors ${featuredParam ? 'bg-brand-950/80 text-brand-300 border border-brand-800 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  ✨ Featured Innovations
                </button>
                <button
                  onClick={() => updateParam('new_arrivals', newArrivalsParam ? null : 'true')}
                  className={`text-left py-1.5 px-2 rounded-lg font-medium transition-colors ${newArrivalsParam ? 'bg-brand-950/80 text-brand-300 border border-brand-800 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  ⚡ New Releases
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center max-w-md mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">
                  We could not find any items matching your selected criteria. Try resetting filters or adjusting search keywords.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-slate-800">
                <button
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-2 border border-slate-800 rounded-xl bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => fetchProducts(pg)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                      currentPage === pg
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => fetchProducts(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-2 border border-slate-800 rounded-xl bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-slate-900 border-l border-slate-800 text-slate-200 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-base font-bold text-white">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Categories</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateParam('category', null);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left text-xs py-1.5 px-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800"
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateParam('category', c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className="w-full text-left text-xs py-1.5 px-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
