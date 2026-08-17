import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const getStorageKey = () => {
    try {
      const raw = localStorage.getItem('userData');
      const userData = raw ? JSON.parse(raw) : null;
      return userData?.email ? `rentease_wishlist_${userData.email}` : 'rentease_wishlist';
    } catch {
      return 'rentease_wishlist';
    }
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem(getStorageKey());
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, []);

  // Listen for login/logout to refresh wishlist
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWishlist = localStorage.getItem(getStorageKey());
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      } else {
        setWishlist([]);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToWishlist = (product) => {
    const productId = product._id || product.id;
    const exists = wishlist.find(item => (item._id || item.id) === productId);
    const key = getStorageKey();

    if (exists) {
      const updated = wishlist.filter(item => (item._id || item.id) !== productId);
      setWishlist(updated);
      localStorage.setItem(key, JSON.stringify(updated));
      toast.error(`${product.name} removed from wishlist`);
    } else {
      const updated = [...wishlist, product];
      setWishlist(updated);
      localStorage.setItem(key, JSON.stringify(updated));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(item => (item._id || item.id) !== productId);
    setWishlist(updated);
    localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(getStorageKey());
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
