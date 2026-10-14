import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/api';

const DEFAULT_SETTINGS = {
  site_name: 'shall_shoop',
  site_tagline: 'Premium Modern E-Commerce',
  site_description:
    'shall_shoop curates premium international consumer electronics, designer apparel, artisan living goods, and active essentials for contemporary living.',
  contact_email: 'dadmohammad2005@gmail.com',
  contact_phone: '+92 300 1234567',
  address: 'Quetta, Balochistan, Pakistan',
  announcement_text:
    'Complimentary Worldwide Shipping over $100 • Use code WELCOME10 for 10% off',
  currency_symbol: '$',
  currency_code: 'USD',
  free_shipping_threshold: 100.0,
  footer_copyright: 'shall_shoop International Inc. All rights reserved.',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  brand_parts: {
    first: 'shall',
    second: '_shoop',
  },
};

/**
 * Client-side brand name splitter fallback in case API hasn't loaded yet.
 * Splits 'shall_shoop' into { first: 'shall', second: '_shoop' }
 * Splits 'Shall Shoop' into { first: 'Shall', second: 'Shoop' }
 */
export function computeBrandParts(name) {
  if (!name) return { first: 'shall', second: '_shoop' };
  const trimmed = name.trim();
  if (trimmed.includes('_')) {
    const parts = trimmed.split('_');
    return { first: parts[0], second: `_${parts.slice(1).join('_')}` };
  }
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(' ');
    return { first: parts[0], second: ` ${parts.slice(1).join(' ')}` };
  }
  const match = trimmed.match(/^([A-Z]?[a-z0-9]+)([A-Z].*)$/);
  if (match) {
    return { first: match[1], second: match[2] };
  }
  const half = Math.ceil(trimmed.length / 2);
  return { first: trimmed.slice(0, half), second: trimmed.slice(half) };
}

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');

  // Fetch settings from API
  const refreshSettings = useCallback(async () => {
    try {
      const res = await settingsService.getSettings();
      if (res && res.data) {
        const data = res.data;
        if (!data.brand_parts && data.site_name) {
          data.brand_parts = computeBrandParts(data.site_name);
        }
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      // Gracefully use local default settings if offline
      console.warn('Store settings API unavailable, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Dynamically update document title
  useEffect(() => {
    const storeName = settings.site_name || 'shall_shoop';
    const tagline = settings.site_tagline || 'Premium Modern E-Commerce';
    if (pageTitle) {
      document.title = `${pageTitle} — ${storeName}`;
    } else {
      document.title = `${storeName} — ${tagline}`;
    }
  }, [pageTitle, settings.site_name, settings.site_tagline]);

  const brandParts = settings.brand_parts || computeBrandParts(settings.site_name);

  return (
    <StoreContext.Provider
      value={{
        settings,
        siteName: settings.site_name || 'shall_shoop',
        tagline: settings.site_tagline,
        description: settings.site_description,
        address: settings.address,
        contactEmail: settings.contact_email,
        contactPhone: settings.contact_phone,
        announcementText: settings.announcement_text,
        currencySymbol: settings.currency_symbol || '$',
        freeShippingThreshold: Number(settings.free_shipping_threshold) || 100,
        copyright: settings.footer_copyright,
        brandParts,
        loading,
        setPageTitle,
        refreshSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default StoreContext;
