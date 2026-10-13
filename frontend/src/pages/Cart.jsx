import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    subtotal,
    shippingCost,
    coupon,
    couponDiscount,
    grandTotal,
    loading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);
    setCouponCodeInput('');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-48 mx-auto mb-4"></div>
        <div className="h-64 bg-slate-800 rounded-3xl max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 py-16 px-4">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-950/80 border border-brand-800/80 text-brand-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our premier catalog to find handcrafted goods and luxury electronics.
          </p>
          <Link
            to="/shop"
            className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-premium inline-flex items-center justify-center gap-2 transition-all"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your selected items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Cart Items Table (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-md overflow-hidden">
              <div className="p-4 sm:p-6 divide-y divide-slate-800">
                {items.map((item) => (
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Item Thumbnail & Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link to={`/products/${item.product.slug}`} className="shrink-0">
                        <img
                          src={item.product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80'}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-950 border border-slate-800"
                        />
                      </Link>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {item.product.category?.name}
                        </span>
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="block text-sm sm:text-base font-bold text-white hover:text-brand-400 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <span className="inline-block mt-0.5 text-xs text-slate-300 font-medium bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                            Variant: {item.variant.name}
                          </span>
                        )}
                        <div className="text-xs sm:text-sm font-bold text-white mt-1 sm:hidden">
                          ${Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center border border-slate-700 rounded-xl bg-slate-800 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg hover:bg-slate-700 text-slate-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_available}
                          className="p-1 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-sm sm:text-base font-extrabold text-white">
                          ${Number(item.total_price).toFixed(2)}
                        </span>
                      </div>

                      {/* Delete Item Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                {subtotal >= 100 ? (
                  <p className="text-xs sm:text-sm font-bold text-emerald-400">
                    Congratulations! Your order qualifies for Free Express Shipping.
                  </p>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-300">
                      Add <span className="font-bold text-brand-400">${(100 - subtotal).toFixed(2)}</span> more to unlock <span className="font-bold text-white">Free Worldwide Shipping</span>!
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Card (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-md">
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                Order Summary
              </h3>

              {/* Cost Lines */}
              <div className="space-y-3 text-xs sm:text-sm mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Coupon ({coupon.code})
                    </span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-bold text-white">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-400">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-300">Total</span>
                  <span className="text-2xl font-black text-white">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="mb-6 pt-4 border-t border-slate-800">
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 rounded-xl text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>{coupon.code} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 hover:bg-emerald-900/50 rounded-lg text-emerald-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs outline-none focus:border-brand-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0 disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-premium flex items-center justify-center gap-2 transition-all mb-4"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
