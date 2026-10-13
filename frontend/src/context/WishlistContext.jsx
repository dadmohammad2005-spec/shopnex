import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your wishlist.', 'info');
      return { success: false, requireAuth: true };
    }

    try {
      const response = await wishlistService.toggleWishlist(product.id);
      setItems(response.data.wishlist?.items || []);
      showToast(response.data.message, 'success');
      return { success: true, inWishlist: response.data.in_wishlist };
    } catch (error) {
      showToast('Unable to update wishlist.', 'error');
      return { success: false };
    }
  };

  const removeFromWishlist = async (itemIdOrProductId) => {
    try {
      const response = await wishlistService.removeFromWishlist(itemIdOrProductId);
      setItems(response.data.items || []);
      showToast('Removed from wishlist.', 'info');
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const isInWishlist = (productId) => {
    return items.some((item) => item.product?.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
