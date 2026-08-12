import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getStorageKey = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData ? `rentease_cart_${userData.email}` : 'rentease_cart';
  };

  // Load cart on mount and listen for storage changes
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem(getStorageKey());
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, tenure, rent) => {
    setCartItems(prev => {
      // Check if item already exists with same tenure
      const existingItem = prev.find(item => item.id === product.id && item.tenure === tenure);
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id && item.tenure === tenure) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, tenure, rent, quantity: 1 }];
    });
  };

  const removeFromCart = (id, tenure) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.tenure === tenure)));
  };

  const updateQuantity = (id, tenure, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.tenure === tenure) 
      ? { ...item, quantity } 
      : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.rent * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};
