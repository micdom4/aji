import {createContext, useContext} from "react";
import type {CartItem} from "./CartContexts.tsx";
import type {ProductType} from "../model/ProductTypes.ts";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: ProductType) => void;
    removeFromCart: (productId: string) => void;
    changeQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};