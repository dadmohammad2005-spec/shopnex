import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';
import { useStore } from './StoreContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { siteName } = useStore();

  const initAuth = useCallback(async () => {
    try {
      // Ensure CSRF cookie is set
      await authService.getCsrf();
      // Fetch current session status
      const response = await authService.getCurrentUser();
      if (response.data && response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      showToast(`Welcome back, ${response.data.user.first_name || response.data.user.username}!`, 'success');
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMsg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        'Invalid credentials. Please verify your email and password.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      showToast(`Registration successful! Welcome to ${siteName}.`, 'success');
      return { success: true, user: response.data.user };
    } catch (error) {
      const errors = error.response?.data || {};
      const errorMsg =
        errors.email?.[0] ||
        errors.username?.[0] ||
        errors.password?.[0] ||
        'Registration failed. Please check your information.';
      showToast(errorMsg, 'error');
      return { success: false, errors };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      showToast('You have been logged out safely.', 'info');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data.user);
      showToast('Your profile has been updated.', 'success');
      return { success: true, user: response.data.user };
    } catch (error) {
      showToast('Failed to update profile. Please verify your inputs.', 'error');
      return { success: false, error: error.response?.data };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: initAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
