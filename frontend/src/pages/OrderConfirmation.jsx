import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  FileText,
} from 'lucide-react';
import { orderService } from '../services/api';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order_number');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      orderService.getOrder(orderNumber)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl mx-auto text-center animate-pulse">
          <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-slate-800 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStatusIndex = steps.findIndex(
    (s) => s.key === (order?.order_status || 'confirmed')
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 sm:py-16 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl text-center mb-8">
          <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            We have dispatched a detailed order confirmation and receipt to{' '}
            <span className="font-semibold text-slate-200">{order?.customer_email || 'your email'}</span>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs sm:text-sm font-mono font-bold text-slate-200">
            <FileText className="w-4 h-4 text-brand-400" />
            Order Reference: <span className="text-brand-400">{order?.order_number || orderNumber}</span>
          </div>
        </div>

        {/* Tracking Progress Steps */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8">
          <h3 className="text-sm font-bold text-white mb-6">Fulfillment Timeline</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
            {steps.map((step, idx) => {
              const isPastOrCurrent = idx <= Math.max(0, currentStatusIndex);
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPastOrCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold mt-2 text-center ${
                    isPastOrCurrent ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Summary */}
        {order && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Receipt & Delivery Summary
            </h3>

            {/* Delivery address & payment method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Recipient & Address
                </span>
                <p className="font-bold text-white text-sm">{order.customer_name}</p>
                <p className="text-slate-300 mt-1">{order.shipping_address}</p>
                <p className="text-slate-300">{order.city}, {order.state} {order.postal_code}, {order.country}</p>
                <p className="text-slate-400 mt-1">{order.customer_phone}</p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Details
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {order.payment_method === 'cod' ? (
                    <Banknote className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-brand-400" />
                  )}
                  <span className="font-bold text-white text-sm">
                    {order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Card Gateway'}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">Status: <span className="font-semibold text-slate-200 capitalize">{order.payment_status}</span></p>
                <p className="text-slate-400">Order Placed: <span className="font-semibold text-slate-200">{new Date(order.created_at).toLocaleString()}</span></p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Items Purchased
              </h4>
              <div className="divide-y divide-slate-800">
                {order.items?.map((it) => (
                  <div key={it.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=80&q=80'}
                        alt={it.product_name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700/50"
                      />
                      <div>
                        <p className="font-bold text-white">{it.product_name}</p>
                        <p className="text-slate-400 text-[11px]">
                          Qty: {it.quantity} {it.variant_name && `• ${it.variant_name}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-300">
                      ${Number(it.total_price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({order.coupon_code})</span>
                  <span>-${Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-bold text-white">
                  {Number(order.shipping_cost) === 0 ? <span className="text-emerald-400">Free</span> : `$${Number(order.shipping_cost).toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-xl sm:text-2xl font-black text-white">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard?tab=orders"
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-brand-900/40 text-center transition-all"
          >
            Track in My Account
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm text-center transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
