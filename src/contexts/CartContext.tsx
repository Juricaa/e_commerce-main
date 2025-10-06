import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produit } from '../types/produit';

type CartLine = {
  product: Produit;
  quantity: number;
};

type CartContextType = {
  cartItems: CartLine[];
  addToCart: (product: Produit) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartLine[]>([]);

  const addToCart = (product: Produit) => {
    if (product.stock <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((line) => line.product.id_produit === product.id_produit);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (newQuantity > product.stock) return prev;
        return prev.map((line) =>
          line.product.id_produit === product.id_produit
            ? { ...line, quantity: newQuantity }
            : line
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((line) => {
          if (line.product.id_produit === productId) {
            const newQuantity = Math.max(1, line.quantity + delta);
            if (newQuantity > line.product.stock) return line;
            return { ...line, quantity: newQuantity };
          }
          return line;
        })
        .filter((line) => line.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((line) => line.product.id_produit !== productId));
  };

  const cartCount = cartItems.reduce((total, line) => total + line.quantity, 0);
  const cartTotal = cartItems.reduce((total, line) => total + line.product.prix * line.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};
