import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

function normalizeCartItem(raw) {
  if (raw == null || typeof raw !== 'object' || raw.id == null) return null;
  return {
    id: raw.id,
    title_ru: raw.title_ru ?? raw.title ?? '',
    title_ro: raw.title_ro ?? '',
    title_en: raw.title_en ?? '',
    price: raw.price,
    image: raw.image,
    stock: raw.stock,
    quantity: Math.max(1, Number(raw.quantity) || 1),
  };
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('tsv_cart');
    if (!savedCart) return [];
    try {
      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeCartItem).filter(Boolean);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tsv_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const qty = Math.max(1, Number(product.quantity) || 1);
    const itemPayload = {
      id: product.id,
      title_ru: product.title_ru ?? product.title ?? '',
      title_ro: product.title_ro ?? '',
      title_en: product.title_en ?? '',
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: qty,
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                title_ru: itemPayload.title_ru || item.title_ru,
                title_ro: itemPayload.title_ro || item.title_ro,
                title_en: itemPayload.title_en || item.title_en,
                quantity: item.quantity + qty,
              }
            : item
        );
      }
      return [...prev, itemPayload];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('tsv_cart');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
