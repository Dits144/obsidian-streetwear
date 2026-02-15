import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const addItem = useCallback((product: Product, size: string, color: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, size, color, quantity: qty }];
    });
    toast({ title: "Added to cart", description: `${product.name} — ${size}, ${color}` });
    setIsOpen(true);
  }, [toast]);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) { removeItem(productId, size, color); return; }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity: qty } : i
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
