import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import { productService } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const { siteName, brandParts, announcementText, address } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Handle clicking outside user dropdown and search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search autocomplete debounced
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productService.getSuggestions(searchQuery.trim());
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all text-slate-100">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{announcementText}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt={`${siteName} Logo`} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {brandParts.first}<span className="text-brand-400">{brandParts.second}</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-0.5">
                {address}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <Link to="/" className={`hover:text-brand-400 transition-colors ${location.pathname === '/' ? 'text-brand-400 font-bold' : ''}`}>
              Home
            </Link>
            <Link to="/shop" className={`hover:text-brand-400 transition-colors ${location.pathname === '/shop' ? 'text-brand-400 font-bold' : ''}`}>
              Shop
            </Link>
            <Link to="/shop?category=electronics-gadgets" className="hover:text-brand-400 transition-colors">
              Electronics
            </Link>
            <Link to="/shop?category=fashion-apparel" className="hover:text-brand-400 transition-colors">
              Fashion
            </Link>
            <Link to="/shop?deals=true" className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors">
              Deals
            </Link>
            <Link to="/about" className="hover:text-brand-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-brand-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, SKUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 hover:bg-slate-850 focus:bg-slate-900 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-full border border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Quick Results
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(`/products/${item.slug}`);
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left"
                  >
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=100&q=80'}
                      alt={item.name}
                      className="w-9 h-9 object-cover rounded-lg shrink-0 bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-brand-400 font-bold">
                        ${Number(item.sale_price || item.price).toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 text-center text-xs font-bold text-brand-400 transition-colors border-t border-slate-800"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
              className="p-2 text-slate-300 hover:text-amber-400 rounded-full hover:bg-slate-800/80 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/dashboard?tab=wishlist"
              className="relative p-2 text-slate-300 hover:text-rose-400 rounded-full hover:bg-slate-800/80 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-brand-400 rounded-full hover:bg-slate-800/80 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-900/80 text-brand-300 font-bold text-xs flex items-center justify-center border border-brand-700">
                    {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user?.first_name || user?.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden z-50 animate-fade-in text-slate-200">
                    <div className="p-4 border-b border-slate-800">
                      <div className="text-xs font-bold text-white truncate">
                        {user?.full_name || user?.username}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                        Account Dashboard
                      </Link>
                      <Link
                        to="/dashboard?tab=orders"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>
                      <Link
                        to="/dashboard?tab=wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Wishlist
                      </Link>
                    </div>
                    <div className="p-1 border-t border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 text-xs text-white placeholder-slate-500 rounded-full border border-slate-800 focus:border-brand-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-2 font-semibold text-slate-200">
            <Link to="/" className="p-2 hover:bg-slate-900 rounded-xl">
              Home
            </Link>
            <Link to="/shop" className="p-2 hover:bg-slate-900 rounded-xl">
              All Products
            </Link>
            <Link to="/shop?category=electronics-gadgets" className="p-2 hover:bg-slate-900 rounded-xl">
              Electronics
            </Link>
            <Link to="/shop?category=fashion-apparel" className="p-2 hover:bg-slate-900 rounded-xl">
              Fashion & Apparel
            </Link>
            <Link to="/shop?deals=true" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl">
              Special Deals
            </Link>
            <Link to="/about" className="p-2 hover:bg-slate-900 rounded-xl">
              About Us
            </Link>
            <Link to="/contact" className="p-2 hover:bg-slate-900 rounded-xl">
              Contact Support
            </Link>

            {!isAuthenticated && (
              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center text-sm font-bold border border-slate-700 rounded-xl text-slate-200 hover:bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-sm"
                >
                  Create an Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
