import { CartItem } from '../types';

const API_URL = 'http://localhost:5000/api/cart';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId: string, item: { productId: string, name: string, price: number, image: string, quantity: number }) => {
    const res = await fetch(`${API_URL}/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
    // Gọi lại addToCart với quantity mới
    return addToCart(userId, { productId, quantity, name: '', price: 0, image: '' });
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId: string, productId: string) => {
    const res = await fetch(`${API_URL}/${userId}/${productId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId: string) => {
    const res = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Lấy giỏ hàng từ backend
export async function fetchCart(userId: string) {
    const res = await fetch(`${API_URL}/${userId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export const getCart = async (userId: string) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const response = await fetch(`${API_URL}/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    return response.json();
}; 