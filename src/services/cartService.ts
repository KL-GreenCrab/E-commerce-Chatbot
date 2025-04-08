import { CartItem } from '../types';

// Lấy giỏ hàng của người dùng từ localStorage
export const getCart = (userId: string): CartItem[] => {
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng vào localStorage
export const saveCart = (userId: string, cart: CartItem[]): void => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (userId: string, item: CartItem): CartItem[] => {
    const cart = getCart(userId);

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);

    if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        cart.push(item);
    }

    // Lưu giỏ hàng đã cập nhật
    saveCart(userId, cart);
    return cart;
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = (userId: string, productId: number, quantity: number): CartItem[] => {
    const cart = getCart(userId);
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
        if (quantity > 0) {
            cart[itemIndex].quantity = quantity;
        } else {
            // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
            cart.splice(itemIndex, 1);
        }
        saveCart(userId, cart);
    }

    return cart;
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (userId: string, productId: number): CartItem[] => {
    const cart = getCart(userId);
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveCart(userId, updatedCart);
    return updatedCart;
};

// Xóa toàn bộ giỏ hàng
export const clearCart = (userId: string): void => {
    localStorage.removeItem(`cart_${userId}`);
};

// Tính tổng giá trị giỏ hàng
export const getCartTotal = (userId: string): number => {
    const cart = getCart(userId);
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Kiểm tra xem giỏ hàng có trống không
export const isCartEmpty = (userId: string): boolean => {
    const cart = getCart(userId);
    return cart.length === 0;
}; 