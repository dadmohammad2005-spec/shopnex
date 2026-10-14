import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useStore } from '../context/StoreContext';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { register } = useAuth();
  const { showToast } = useToast();
  const { siteName, brandParts, address } = useStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      navigate(redirect);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 transition-colors">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 flex items-center justify-center">
              <img src="/logo.png" alt={`${siteName} Logo`} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black text-white tracking-tight leading-tight">
                {brandParts.first}<span className="text-brand-400">{brandParts.second}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                {address}
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the premier shopping club and unlock bespoke benefits.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="Alexander"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="Morgan"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="alex_morgan"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="alexander@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password (min 8 characters)</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••••••"
                value={formData.password_confirm}
                onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="font-bold text-brand-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
