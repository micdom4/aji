import React, {type ReactNode, useEffect, useMemo, useState} from 'react';
import type {ProductType} from '../model/ProductTypes';
import useToast from '../components/toasts/useToast';
import { CartContext } from "./useCart";

export interface CartItem {
    product: ProductType;
    quantity: number;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        const storedCart = localStorage.getItem('shopping-cart');
        if (storedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: ProductType) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product._id === product._id);

            if (existingItem) {
                addToast('Updated', `Increased quantity for ${product.name}`, 'info');
                return prevItems.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                addToast('Added', `${product.name} added to cart`, 'success');
                return [...prevItems, { product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
    };

    const changeQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('shopping-cart');
    };

    const cartTotal = useMemo(() => {
        return items.reduce((total, item) => total + (item.product.unitPrice * item.quantity), 0);
    }, [items]);

    const cartCount = useMemo(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, changeQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};