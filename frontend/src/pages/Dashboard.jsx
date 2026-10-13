import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  Key,
  LogOut,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { orderService, authService } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, isAuthenticated, loading: authLoading, updateProfile, logout } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Change state
  const [passData, setPassData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passSaving, setPassSaving] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || 'United States',
      });
    }
  }, [user]);

  // Fetch orders when tab is orders
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'orders' || activeTab === 'profile')) {
      setOrdersLoading(true);
      orderService.getOrders()
        .then((res) => setOrders(res.data || []))
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [isAuthenticated, activeTab]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    await updateProfile(profileData);
    setProfileSaving(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm_password) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passData.new_password.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }

    try {
      setPassSaving(true);
      await authService.changePassword({
        old_password: passData.old_password,
        new_password: passData.new_password,
      });
      showToast('Password changed successfully!', 'success');
      setPassData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const msg = err.response?.data?.old_password?.[0] || 'Failed to update password.';
      showToast(msg, 'error');
    } finally {
      setPassSaving(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order? Stock will be immediately restored.')) return;
    try {
      const res = await orderService.cancelOrder(orderId);
      showToast('Order cancelled successfully.', 'info');
      // Refresh order list
      const updated = await orderService.getOrders();
      setOrders(updated.data || []);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.data?.order);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Unable to cancel this order.';
      showToast(msg, 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-48 mx-auto mb-4"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Account Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile, review order history, and track saved items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar (3 cols) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-brand-950 border border-brand-800/80 text-brand-400 font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <h3 className="font-extrabold text-white text-base">{user?.full_name || user?.username}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-xl space-y-1">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'profile' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" /> Profile Details
              </button>
              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'orders' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" /> Order History ({orders.length})
              </button>
              <button
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'wishlist' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" /> Saved Wishlist ({wishlistItems.length})
              </button>
              <button
                onClick={() => handleTabChange('security')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'security' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" /> Password & Security
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main Tab Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  Personal & Shipping Information
                </h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">First Name</label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full px-3 py-2 border border-slate-800 rounded-xl text-xs sm:text-sm bg-slate-850 text-slate-500 cursor-not-allowed outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Default Shipping Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">State / Province</label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Postal / ZIP Code</label>
                      <input
                        type="text"
                        value={profileData.postal_code}
                        onChange={(e) => setProfileData({ ...profileData, postal_code: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-brand-900/40 transition-colors disabled:opacity-50"
                    >
                      {profileSaving ? 'Saving Changes...' : 'Save Profile Information'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  Order History & Fulfillment
                </h3>

                {ordersLoading ? (
                  <p className="text-xs text-slate-400 py-6 text-center">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-4">You have not placed any orders yet.</p>
                    <Link to="/shop" className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold inline-block shadow-lg shadow-brand-900/40 transition-all">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-sm">#{ord.order_number}</span>
                            {getStatusBadge(ord.order_status)}
                          </div>
                          <p className="text-xs text-slate-400">
                            Placed on {new Date(ord.created_at).toLocaleDateString()} • {ord.item_count} {ord.item_count === 1 ? 'item' : 'items'}
                          </p>
                          <p className="text-xs font-bold text-brand-300 mt-1">
                            Total: ${Number(ord.total_amount).toFixed(2)} ({ord.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Receipt
                          </button>
                          {['pending', 'confirmed'].includes(ord.order_status) && (
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  Saved Wishlist Items ({wishlistItems.length})
                </h3>

                {wishlistItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-4">Your wishlist is currently empty.</p>
                    <Link to="/shop" className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold inline-block shadow-lg shadow-brand-900/40 transition-all">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <ProductCard key={item.product.id} product={item.product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                  Change Account Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={passData.old_password}
                      onChange={(e) => setPassData({ ...passData, old_password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">New Password (min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={passData.new_password}
                      onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={passData.confirm_password}
                      onChange={(e) => setPassData({ ...passData, confirm_password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-800 text-white focus:bg-slate-800 outline-none focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passSaving}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-900/40 disabled:opacity-50"
                  >
                    {passSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Order Details Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="mb-4">
              <span className="text-xs font-bold text-brand-400 font-mono">#{selectedOrder.order_number}</span>
              <h3 className="text-lg font-bold text-white mt-1">Order Details</h3>
              <p className="text-xs text-slate-400">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl mb-4 text-xs space-y-1">
              <p><span className="font-semibold text-slate-300">Status:</span> {getStatusBadge(selectedOrder.order_status)}</p>
              <p><span className="font-semibold text-slate-300">Delivery Address:</span> {selectedOrder.shipping_address}, {selectedOrder.city}, {selectedOrder.state} {selectedOrder.postal_code}</p>
              <p><span className="font-semibold text-slate-300">Payment:</span> {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'} ({selectedOrder.payment_status})</p>
            </div>

            <div className="divide-y divide-slate-800 mb-4 max-h-48 overflow-y-auto pr-1">
              {selectedOrder.items?.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{it.product_name}</p>
                    <p className="text-slate-400">Qty: {it.quantity} {it.variant_name && `• ${it.variant_name}`}</p>
                  </div>
                  <span className="font-bold text-brand-300">${Number(it.total_price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-${Number(selectedOrder.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                <span>${Number(selectedOrder.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="text-brand-300">${Number(selectedOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
