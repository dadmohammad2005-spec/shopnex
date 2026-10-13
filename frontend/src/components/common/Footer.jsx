import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Thank you for subscribing to ShopNex updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Badges Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Global Express Delivery</h4>
              <p className="text-xs text-slate-400">Complimentary on all orders over $100</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Secure Transaction</h4>
              <p className="text-xs text-slate-400">256-bit encrypted checkout protection</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">Full refunds with prepaid return labels</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Flexible Payment Options</h4>
              <p className="text-xs text-slate-400">Cash on Delivery & multi-currency support</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 flex items-center justify-center">
                <img src="/logo.png" alt="ShopNex Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">
                  Shop<span className="text-brand-400">Nex</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                  Quetta, Balochistan
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              ShopNex curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Quetta, Balochistan, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+92 300 0000000 (24/7 Desk)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:dadmohammad2005@gmail.com" className="hover:text-white transition-colors">
                  dadmohammad2005@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop & Explore</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=electronics-gadgets" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/shop?category=fashion-apparel" className="hover:text-white transition-colors">Designer Fashion</Link></li>
              <li><Link to="/shop?category=home-living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/shop?deals=true" className="hover:text-white transition-colors">Exclusive Deals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Client Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/dashboard?tab=orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal & Privacy</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-6">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About ShopNex</Link></li>
            </ul>

            <h5 className="text-xs font-bold text-white mb-2">Join the VIP Newsletter</h5>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center justify-center transition-colors"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNex International Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-semibold text-slate-500">Supported Payments:</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
