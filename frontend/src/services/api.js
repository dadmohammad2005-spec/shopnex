import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to extract cookie by name
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Request Interceptor to attach Django CSRF Token
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  getCsrf: () => api.get('/accounts/csrf/'),
  getCurrentUser: () => api.get('/accounts/current-user/'),
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: () => api.post('/accounts/logout/'),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/', data),
  changePassword: (data) => api.post('/accounts/change-password/', data),
};

export const productService = {
  getCategories: () => api.get('/categories/'),
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProduct: (slugOrId) => api.get(`/products/${slugOrId}/`),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related/`),
  getSuggestions: (q) => api.get('/products/suggestions/', { params: { q } }),
};

export const cartService = {
  getCart: () => api.get('/cart/'),
  addToCart: (product_id, quantity = 1, variant_id = null) =>
    api.post('/cart/items/', { product_id, quantity, variant_id }),
  updateQuantity: (itemId, quantity) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
  clearCart: () => api.post('/cart/clear/'),
};

export const orderService = {
  checkout: (data) => api.post('/orders/checkout/', data),
  getOrders: () => api.get('/orders/'),
  getOrder: (identifier) => api.get(`/orders/${identifier}/`),
  cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel/`),
};

export const couponService = {
  validate: (code, subtotal) => api.post('/coupons/validate/', { code, subtotal }),
};

export const reviewService = {
  getProductReviews: (productId) => api.get(`/products/${productId}/reviews/`),
  addReview: (productId, data) => api.post(`/products/${productId}/reviews/`, data),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist/'),
  addToWishlist: (product_id) => api.post('/wishlist/items/', { product_id }),
  toggleWishlist: (product_id) => api.post('/wishlist/toggle/', { product_id }),
  removeFromWishlist: (itemIdOrProductId) => api.delete(`/wishlist/items/${itemIdOrProductId}/`),
};

export const contactService = {
  sendMessage: (data) => api.post('/contact/', data),
};

export const settingsService = {
  getSettings: () => api.get('/settings/'),
  updateSettings: (data) => api.patch('/settings/', data),
};

export default api;

