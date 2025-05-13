import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { CartItem } from '../types';
import * as cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

export function useCart() {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const cart = await cartService.getCart(user._id);
            setCart(cart.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user?._id]);

    const add = async (item: CartItem) => {
        if (!user?._id) return;
        try {
            await cartService.addToCart(user._id, item);
            await fetchCart();
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user?._id) return;
        try {
            await cartService.updateCartItemQuantity(user._id, productId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };

    const remove = async (productId: string) => {
        if (!user?._id) return;
        try {
            await cartService.removeFromCart(user._id, productId);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const clear = async () => {
        if (!user?._id) return;
        try {
            await cartService.clearCart(user._id);
            setCart([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Tính tổng giá trị giỏ hàng
    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Kiểm tra giỏ hàng trống
    const isEmpty = () => {
        return cart.length === 0;
    };

    return { cart, loading, add, updateQuantity, remove, clear, getTotal, isEmpty };
} 