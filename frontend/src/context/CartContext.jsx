import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, couponService } from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch cart when auth state changes (to merge session cart with user cart)
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      const response = await cartService.addToCart(productId, quantity, variantId);
      setCart(response.data);
      setItems(response.data.items || []);
      showToast('Item added to your shopping cart!', 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Unable to add item to cart.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await cartService.updateQuantity(itemId, quantity);
      setCart(response.data);
      setItems(response.data.items || []);
      if (quantity === 0) {
        showToast('Item removed from cart.', 'info');
      }
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to update quantity.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartService.removeItem(itemId);
      setCart(response.data);
      setItems(response.data.items || []);
      showToast('Item removed from cart.', 'info');
      return { success: true };
    } catch (error) {
      showToast('Failed to remove item.', 'error');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
      setItems([]);
      setCoupon(null);
      setCouponDiscount(0);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const subtotal = Number(cart?.subtotal || 0);
  const totalItems = Number(cart?.total_items || 0);

  // Free shipping over $100, otherwise $10 flat rate (if items exist)
  const shippingCost = totalItems > 0 ? (subtotal >= 100 ? 0 : 10) : 0;

  // Re-evaluate coupon if subtotal changes
  useEffect(() => {
    if (coupon) {
      couponService.validate(coupon.code, subtotal)
        .then((res) => {
          if (res.data.valid) {
            setCouponDiscount(Number(res.data.discount_amount || 0));
          } else {
            setCoupon(null);
            setCouponDiscount(0);
          }
        })
        .catch(() => {
          setCoupon(null);
          setCouponDiscount(0);
        });
    }
  }, [subtotal, coupon?.code]);

  const applyCoupon = async (code) => {
    try {
      const response = await couponService.validate(code, subtotal);
      if (response.data.valid) {
        setCoupon({
          code: response.data.code,
          discount_type: response.data.discount_type,
          discount_value: response.data.discount_value,
        });
        setCouponDiscount(Number(response.data.discount_amount));
        showToast(`Coupon "${response.data.code}" applied!`, 'success');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Invalid or expired promo code.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed.', 'info');
  };

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        totalItems,
        subtotal,
        shippingCost,
        coupon,
        couponDiscount,
        grandTotal,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
