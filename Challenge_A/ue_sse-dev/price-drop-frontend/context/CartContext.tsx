"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Product } from "@/types";

// --- Type Definitions ---

interface CartContextType {
    cartItems: Product[];
    cartId: string | null;
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    resetCartSession: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider Component ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);

    const updateAndSyncBackend = async (newItems: Product[]) => {
        let currentCartId = cartId;

        if (!currentCartId) {
            try {
                const response = await fetch(apiUrl("api/cart"), { method: "POST" });
                if (!response.ok) throw new Error("Failed to create cart session");
                const { cart_id } = await response.json();
                currentCartId = cart_id;
                setCartId(cart_id);
            } catch (error) {
                console.error("Error creating cart:", error);
                return;
            }
        }

        try {
            await fetch(apiUrl(`api/cart/${currentCartId}`), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: newItems }),
            });

            setCartItems(newItems);

        } catch (error) {
            console.error("Error syncing cart:", error);
        }
    };

    // --- Action Handlers ---

    const addToCart = (product: Product) => {
        const existing = cartItems.find(item => item.id === product.id);
        let newItems;
        if (existing) {
            newItems = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            );
        } else {
            newItems = [...cartItems, { ...product, quantity: 1 }];
        }
        updateAndSyncBackend(newItems);
    };

    const removeFromCart = (id: string) => {
        const newItems = cartItems.filter(item => item.id !== id);
        updateAndSyncBackend(newItems);
    };

    const clearCart = () => {
        updateAndSyncBackend([]);
    };

    const increaseQuantity = (id: string) => {
        const newItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
        updateAndSyncBackend(newItems);
    };

    const decreaseQuantity = (id: string) => {
        const newItems = cartItems
            .map(item =>
                item.id === id ? { ...item, quantity: Math.max(0, (item.quantity || 1) - 1) } : item
            )
            .filter(item => item.quantity && item.quantity > 0);
        updateAndSyncBackend(newItems);
    };

    const resetCartSession = () => {
        setCartItems([]);
        setCartId(null);
    };

    useEffect(() => {
        (window as any).cart = {
            cartId,
            cartItems,
            setCartItems: (items: Product[]) => {
                updateAndSyncBackend(items);
            },
            addToCart,
            removeFromCart,
            clearCart,
            increaseQuantity,
            decreaseQuantity,
            resetCartSession,
        };
    }, [addToCart, cartId, cartItems, clearCart, decreaseQuantity, increaseQuantity, removeFromCart, updateAndSyncBackend]);

    return (
        <CartContext.Provider value={{ cartItems, cartId, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, resetCartSession }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
