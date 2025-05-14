import { CartItem } from '../types';

// Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
const API_URL = '/api/cart';

// Validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
};

// Get auth token helper function
const getAuthToken = (): string | null => {
    try {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            return null;
        }

        const authData = JSON.parse(auth);
        return authData.token || null;
    } catch (e) {
        console.error('Error getting auth token:', e);
        return null;
    }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId: string, item: { productId: string, name: string, price: number, image: string, quantity: number }) => {
    try {
        // Validate userId format
        if (!userId || !isValidObjectId(userId)) {
            console.error('Invalid user ID format:', userId);
            throw new Error('Invalid user ID format');
        }

        const token = getAuthToken();
        if (!token) {
            throw new Error('Unauthorized: Please login first');
        }

        console.log(`Adding item to cart for user ${userId}:`, item);

        const res = await fetch(`${API_URL}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error adding to cart:', res.status, errorText);
            throw new Error(`Failed to add to cart: ${res.status} ${errorText || 'Unknown error'}`);
        }

        const result = await res.json();
        console.log('Add to cart response:', result);
        return result;
    } catch (error) {
        console.error('addToCart error:', error);
        throw error;
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
    try {
        // Validate userId format
        if (!userId || !isValidObjectId(userId)) {
            console.error('Invalid user ID format:', userId);
            throw new Error('Invalid user ID format');
        }

        const token = getAuthToken();
        if (!token) {
            throw new Error('Unauthorized: Please login first');
        }

        console.log(`Updating quantity for item ${productId} in cart for user ${userId} to ${quantity}`);

        // Only update if quantity is positive
        if (quantity <= 0) {
            return removeFromCart(userId, productId);
        }

        // Gọi lại addToCart với quantity mới
        return addToCart(userId, { productId, quantity, name: '', price: 0, image: '' });
    } catch (error) {
        console.error('updateCartItemQuantity error:', error);
        throw error;
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (userId: string, productId: string) => {
    try {
        // Validate userId format
        if (!userId || !isValidObjectId(userId)) {
            console.error('Invalid user ID format:', userId);
            throw new Error('Invalid user ID format');
        }

        const token = getAuthToken();
        if (!token) {
            throw new Error('Unauthorized: Please login first');
        }

        console.log(`Removing item ${productId} from cart for user ${userId}`);

        const res = await fetch(`${API_URL}/${userId}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error removing from cart:', res.status, errorText);
            throw new Error(`Failed to remove from cart: ${res.status} ${errorText || 'Unknown error'}`);
        }

        const result = await res.json();
        console.log('Remove from cart response:', result);
        return result;
    } catch (error) {
        console.error('removeFromCart error:', error);
        throw error;
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId: string) => {
    try {
        // Validate userId format
        if (!userId || !isValidObjectId(userId)) {
            console.error('Invalid user ID format:', userId);
            throw new Error('Invalid user ID format');
        }

        const token = getAuthToken();
        if (!token) {
            throw new Error('Unauthorized: Please login first');
        }

        console.log(`Clearing cart for user ${userId}`);

        const res = await fetch(`${API_URL}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error clearing cart:', res.status, errorText);
            throw new Error(`Failed to clear cart: ${res.status} ${errorText || 'Unknown error'}`);
        }

        const result = await res.json();
        console.log('Clear cart response:', result);
        return result;
    } catch (error) {
        console.error('clearCart error:', error);
        throw error;
    }
};

// Lấy giỏ hàng từ backend
export async function fetchCart(userId: string) {
    try {
        // Validate userId format
        if (!userId || !isValidObjectId(userId)) {
            console.error('Invalid user ID format:', userId);
            return { items: [] }; // Return empty cart for invalid IDs
        }

        const token = getAuthToken();
        if (!token) {
            console.warn('No auth token available for fetchCart');
            return { items: [] };
        }

        console.log(`Fetching cart for user ${userId}`);

        const res = await fetch(`${API_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error fetching cart:', res.status, errorText);

            // Return empty cart for auth errors instead of throwing
            if (res.status === 401 || res.status === 403) {
                return { items: [] };
            }

            throw new Error(`Failed to fetch cart: ${res.status} ${errorText || 'Unknown error'}`);
        }

        const result = await res.json();
        console.log('Fetch cart response:', result);
        return result;
    } catch (error) {
        console.error('fetchCart error:', error);
        return { items: [] }; // Return empty cart on error
    }
}

export const getCart = async (userId: string) => {
    try {
        // Validate userId format - MongoDB ObjectId must be a 24-character hex string
        if (!userId || typeof userId !== 'string') {
            console.error('Invalid user ID type:', typeof userId);
            return { items: [] };
        }

        // Check if userId is a valid MongoDB ObjectId
        if (!isValidObjectId(userId)) {
            console.error('Invalid MongoDB ObjectId format:', userId);
            // Return empty cart instead of throwing an error
            return { items: [] };
        }

        const token = getAuthToken();
        if (!token) {
            console.error('No auth token available');
            return { items: [] };
        }

        console.log(`Making request to ${API_URL}/${userId} with token`);

        const response = await fetch(`${API_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let errorText = '';
            try {
                const errorData = await response.text();
                errorText = errorData;
                console.error('Cart API error response:', response.status, errorData);
            } catch (e) {
                console.error('Error parsing error response:', e);
            }

            // Return empty cart instead of throwing for common errors
            if (response.status === 401 || response.status === 403) {
                console.error('Authentication error fetching cart');
                return { items: [] };
            }

            throw new Error(`Failed to fetch cart: ${response.status} ${errorText || 'Unknown error'}`);
        }

        const cartData = await response.json();
        console.log('Cart data from API:', cartData);
        return cartData;
    } catch (error) {
        console.error('getCart error:', error);
        // Return empty cart instead of throwing
        return { items: [] };
    }
};