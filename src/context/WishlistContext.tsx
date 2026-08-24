import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WishlistItem } from '../types';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = 'lywaro-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((productId: string) => {
    setItems(prev => {
      if (prev.some(i => i.productId === productId)) return prev;
      return [...prev, { productId, addedAt: new Date() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setItems(prev => {
      if (prev.some(i => i.productId === productId)) {
        return prev.filter(i => i.productId !== productId);
      }
      return [...prev, { productId, addedAt: new Date() }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(i => i.productId === productId);
  }, [items]);

  const getCount = useCallback(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
