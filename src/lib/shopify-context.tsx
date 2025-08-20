"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ShopifyProduct, fetchShopifyProducts } from './shopify';

interface ShopifyContextType {
  products: ShopifyProduct[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  addToCart: (product: ShopifyProduct, variantId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

interface CartItem {
  id: string;
  product: ShopifyProduct;
  variantId: string;
  quantity: number;
  price: number;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load products from Shopify
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchShopifyProducts(50);
        const shopifyProducts = data.products.edges.map(edge => edge.node);
        setProducts(shopifyProducts);
      } catch (err) {
        console.error('Failed to load Shopify products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('boldfarm-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to parse saved cart:', err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('boldfarm-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ShopifyProduct, variantId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id && item.variantId === variantId
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const variant = product.variants.edges.find(edge => edge.node.id === variantId);
        if (!variant) return prevCart;

        const newItem: CartItem = {
          id: `${product.id}-${variantId}`,
          product,
          variantId,
          quantity,
          price: parseFloat(variant.node.price.amount)
        };

        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: ShopifyContextType = {
    products,
    loading,
    error,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
}

export function useShopify() {
  const context = useContext(ShopifyContext);
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
}
