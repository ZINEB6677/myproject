'use client';

// ============================================================
// Cart Context - Shopping cart state management
// ============================================================

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { Book, CartItem } from '@/types';

interface CartContextType {
    items: CartItem[];
    addToCart: (book: Book, quantity?: number) => void;
    removeFromCart: (bookId: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('cart');
            if (stored) setItems(JSON.parse(stored));
        } catch {
            localStorage.removeItem('cart');
        }
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((book: Book, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.book._id === book._id);
            if (existing) {
                return prev.map((item) =>
                    item.book._id === book._id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, book.stock) }
                        : item
                );
            }
            return [...prev, { book, quantity }];
        });
    }, []);

    const removeFromCart = useCallback((bookId: string) => {
        setItems((prev) => prev.filter((item) => item.book._id !== bookId));
    }, []);

    const updateQuantity = useCallback((bookId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) => item.book._id !== bookId));
        } else {
            setItems((prev) =>
                prev.map((item) =>
                    item.book._id === bookId ? { ...item, quantity } : item
                )
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
