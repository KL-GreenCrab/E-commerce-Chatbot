import { CartItem } from '../types';

const API_URL = 'http://localhost:5000/api/cart';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId: string, item: { productId: string, name: string, price: number, image: string, quantity: number }) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    // Validate quantity
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    console.log('Updating cart item quantity:', { userId, productId, quantity });

    try {
        const url = `${API_URL}/${userId}/${productId}`;
        console.log('Request URL:', url);

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error updating quantity:', {
                status: res.status,
                statusText: res.statusText,
                error: errorText,
                url
            });
            throw new Error(errorText);
        }

        const data = await res.json();
        console.log('Update successful:', data);
        return data;
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        throw error;
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId: string, productId: string) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${userId}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId: string) => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Lấy giỏ hàng từ backend
export async function fetchCart(userId: string) {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        throw new Error('Unauthorized: Please login first');
    }
    const { token } = JSON.parse(auth);
    if (!token) {
        throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(`${API_URL}/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
} 