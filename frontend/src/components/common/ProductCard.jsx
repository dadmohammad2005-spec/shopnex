import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import StarRating from './StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const res = await addToCart(product.id, 1);
    setAdding(false);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.has_discount && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
              -{product.discount_percent}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-sm">
              New
            </span>
          )}
          {product.is_bestseller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
              Popular
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 shadow-sm border border-slate-700">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-rose-950/90 text-rose-400 border border-rose-800 shadow-sm'
              : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 hover:bg-slate-900 border border-slate-700 shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <Link
            to={`/products/${product.slug}`}
            className="w-full py-2 bg-slate-900/90 backdrop-blur text-slate-100 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 border border-slate-700 shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
            {product.category?.name || 'General'}
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="font-medium text-white text-sm sm:text-base line-clamp-2 hover:text-brand-400 transition-colors leading-snug mb-2"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={product.rating} reviewCount={product.review_count} />
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-white">
                ${Number(product.effective_price).toFixed(2)}
              </span>
              {product.has_discount && (
                <span className="text-xs text-slate-500 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            aria-label="Add to cart"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-brand-600 hover:bg-brand-500 active:scale-95 text-white shadow-sm hover:shadow'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
