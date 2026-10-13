import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  CheckCircle2,
  Lock,
  AlertCircle,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, shippingCost, coupon, couponDiscount, grandTotal, clearCart } = useCart();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone_number || '',
    shipping_address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'United States',
    order_notes: '',
    payment_method: 'cod', // 'cod' or 'card_placeholder'
  });

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.full_name || user.username,
        customer_email: prev.customer_email || user.email,
        customer_phone: prev.customer_phone || user.phone_number || '',
        shipping_address: prev.shipping_address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        postal_code: prev.postal_code || user.postal_code || '',
        country: prev.country || user.country || 'United States',
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 py-16 px-4">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center max-w-md w-full shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Cart is empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold inline-block shadow-lg shadow-brand-900/40 transition-all">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errors = {};
    if (!formData.customer_name.trim()) errors.customer_name = 'Full name is required';
    if (!formData.customer_email.trim() || !formData.customer_email.includes('@')) errors.customer_email = 'Valid email is required';
    if (!formData.customer_phone.trim()) errors.customer_phone = 'Phone number is required';
    if (!formData.shipping_address.trim()) errors.shipping_address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State / Province is required';
    if (!formData.postal_code.trim()) errors.postal_code = 'Postal code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill in all required shipping details.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        coupon_code: coupon?.code || '',
      };

      const response = await orderService.checkout(payload);
      const order = response.data;
      showToast(`Order #${order.order_number} confirmed!`, 'success');
      await clearCart();
      navigate(`/order-confirmation?order_number=${order.order_number}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order. Please review your stock or address.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link to="/cart" className="hover:text-slate-200 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">Secure Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} id="checkout-form">
              {/* 1. Customer Information */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-6">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Hamilton"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.customer_name ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.customer_name && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.customer_name}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="alexander@example.com"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.customer_email ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.customer_email && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.customer_email}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.customer_phone ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.customer_phone && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.customer_phone}</span>}
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-6">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  2. Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      placeholder="House/Apt, Street name"
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.shipping_address ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.shipping_address && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.shipping_address}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">City *</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.city ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.city && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.city}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">State / Province *</label>
                    <input
                      type="text"
                      placeholder="e.g. CA"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.state ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.state && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.state}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      placeholder="94105"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-800/80 text-white placeholder-slate-500 focus:bg-slate-800 outline-none transition-colors ${
                        formErrors.postal_code ? 'border-rose-500' : 'border-slate-700 focus:border-brand-500'
                      }`}
                    />
                    {formErrors.postal_code && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.postal_code}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Instructions / Notes (Optional)</label>
                    <textarea
                      rows="2"
                      placeholder="Leave with concierge or ring gate bell #402"
                      value={formData.order_notes}
                      onChange={(e) => setFormData({ ...formData, order_notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 outline-none focus:border-brand-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  3. Payment Method
                </h3>
                <div className="space-y-3">
                  {/* COD (Active) */}
                  <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.payment_method === 'cod'
                      ? 'border-brand-500 bg-brand-950/40 text-white'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                      className="mt-1 text-brand-500 focus:ring-brand-500 accent-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-bold text-white">Cash on Delivery (COD)</span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                          Ready & Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Pay in cash or card upon package arrival at your doorstep. Verified courier delivery.
                      </p>
                    </div>
                  </label>

                  {/* Card Gateway Sandbox Placeholder */}
                  <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.payment_method === 'card_placeholder'
                      ? 'border-brand-500 bg-brand-950/40 text-white'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="card_placeholder"
                      checked={formData.payment_method === 'card_placeholder'}
                      onChange={() => setFormData({ ...formData, payment_method: 'card_placeholder' })}
                      className="mt-1 text-brand-500 focus:ring-brand-500 accent-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-400" />
                        <span className="text-sm font-bold text-white">Credit / Debit Card (Gateway Placeholder)</span>
                        <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                          Sandbox Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Place order in pending status for online payment gateway integration (Stripe / PayPal sandbox).
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl sticky top-28">
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-6 divide-y divide-slate-800">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=80&q=80'}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <span className="text-[11px] text-slate-400">
                        Qty: {item.quantity} {item.variant && `• ${item.variant.name}`}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-brand-300 shrink-0">
                      ${Number(item.total_price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-slate-800 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({coupon.code})</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-bold text-white">
                    {shippingCost === 0 ? <span className="text-emerald-400">Free</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-white">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {submitting ? 'Securing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted • Strict Customer Data Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
