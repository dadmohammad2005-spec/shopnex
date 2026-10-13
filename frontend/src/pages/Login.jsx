import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(redirect);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@shopnex.com');
    setPassword('Customer12345!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 transition-colors">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 flex items-center justify-center">
              <img src="/logo.png" alt="ShopNex Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black text-white tracking-tight leading-tight">
                Shop<span className="text-brand-400">Nex</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Quetta, Balochistan
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">Access your orders, saved favorites, and member concierge.</p>
        </div>

        {/* Quick Demo Credentials Pill */}
        <div className="mb-6 p-3 bg-brand-950/50 border border-brand-800/80 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-brand-300 block">Instant Demo Access</span>
            <span className="text-brand-400 text-[11px]">customer@shopnex.com</span>
          </div>
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-[11px] transition-colors shadow-sm"
          >
            Auto-fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email or Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to={`/register?redirect=${redirect}`} className="font-bold text-brand-400 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
