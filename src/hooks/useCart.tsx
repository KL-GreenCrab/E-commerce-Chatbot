import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { CartItem } from '../types';
import * as cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

export const useCart = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load giỏ hàng khi user thay đổi
    useEffect(() => {
        if (user) {
            const userCart = cartService.getCart(user.id);
            setCart(userCart);
        } else {
            setCart([]);
        }
    }, [user]);

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (product: any, quantity: number = 1) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        setIsLoading(true);
        try {
            const cartItem: CartItem = {
                id: Date.now(), // Generate a unique ID
                productId: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image,
                quantity
            };

            const updatedCart = cartService.addToCart(user.id, cartItem);
            setCart(updatedCart);
            toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (productId: number, quantity: number) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const updatedCart = cartService.updateCartItemQuantity(user.id, productId, quantity);
            setCart(updatedCart);
        } catch (error) {
            toast.error('Không thể cập nhật số lượng sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId: number) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const updatedCart = cartService.removeFromCart(user.id, productId);
            setCart(updatedCart);
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
        } finally {
            setIsLoading(false);
        }
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        if (!user) return;

        setIsLoading(true);
        try {
            cartService.clearCart(user.id);
            setCart([]);
            toast.success('Đã xóa toàn bộ giỏ hàng');
        } catch (error) {
            toast.error('Không thể xóa giỏ hàng');
        } finally {
            setIsLoading(false);
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

    return {
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        isEmpty
    };
}; 