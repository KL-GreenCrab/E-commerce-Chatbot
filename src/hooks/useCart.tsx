import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { CartItem } from '../types';
import * as cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

// Validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
};

export function useCart() {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (!user?._id) {
            console.log('No user ID available, cannot fetch cart');
            setCart([]);
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Check if user._id is a valid MongoDB ObjectId
            if (!isValidObjectId(user._id)) {
                console.error('Invalid user ID format in useCart:', user._id);
                setCart([]);
                setCartItems([]);
                return;
            }

            console.log('Fetching cart for user:', user._id);
            const cartData = await cartService.getCart(user._id);

            if (cartData && Array.isArray(cartData.items)) {
                console.log('Cart data received:', cartData);
                setCart(cartData.items);
                setCartItems(cartData.items);
            } else if (cartData && !cartData.items) {
                console.log('Cart exists but has no items array:', cartData);
                setCart([]);
                setCartItems([]);
            } else {
                console.log('No cart data received, setting empty cart');
                setCart([]);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Could not load your cart. Please try again later.');
            // Set empty cart to prevent UI issues
            setCart([]);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user?._id]);

    // Helper function to validate MongoDB ObjectId
    const isValidObjectId = (id: string): boolean => {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(id);
    };

    const add = async (item: CartItem) => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            console.error('Invalid user ID format in add:', user._id);
            toast.error('Could not add item to cart. Please try logging in again.');
            return;
        }

        try {
            await cartService.addToCart(user._id, item);
            await fetchCart();
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Could not add item to cart. Please try again.');
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            console.error('Invalid user ID format in updateQuantity:', user._id);
            toast.error('Could not update cart. Please try logging in again.');
            return;
        }

        try {
            await cartService.updateCartItemQuantity(user._id, productId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Error updating cart item:', error);
            toast.error('Could not update cart. Please try again.');
        }
    };

    const remove = async (productId: string) => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            console.error('Invalid user ID format in remove:', user._id);
            toast.error('Could not remove item from cart. Please try logging in again.');
            return;
        }

        try {
            await cartService.removeFromCart(user._id, productId);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Could not remove item from cart. Please try again.');
        }
    };

    const clear = async () => {
        if (!user?._id) return;
        if (!isValidObjectId(user._id)) {
            console.error('Invalid user ID format in clear:', user._id);
            // Just clear the local cart without calling the API
            setCart([]);
            setCartItems([]);
            return;
        }

        try {
            await cartService.clearCart(user._id);
            setCart([]);
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Could not clear cart. Please try again.');
            // Still clear the local cart even if the API call fails
            setCart([]);
            setCartItems([]);
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

    useEffect(() => {
        console.log('Cart items updated:', cartItems);
    }, [cartItems]);

    return {
        cart,
        cartItems,
        loading,
        add,
        updateQuantity,
        remove,
        clear,
        getTotal,
        isEmpty,
        fetchCart,
        setCartItems
    };
}