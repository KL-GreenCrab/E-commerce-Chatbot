import { CartItem, Order as OrderType } from '../types';

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    };
    paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
    createdAt: string;
}

// Lưu đơn hàng vào localStorage
export const saveOrder = (order: Order): void => {
    const orders = getOrders(order.userId);
    orders.push(order);
    localStorage.setItem(`orders_${order.userId}`, JSON.stringify(orders));
};

// Lấy danh sách đơn hàng của người dùng
export const getOrders = (userId: string): Order[] => {
    const orders = localStorage.getItem(`orders_${userId}`);
    return orders ? JSON.parse(orders) : [];
};

// Tạo đơn hàng mới
export const createOrder = (
    userId: string,
    items: CartItem[],
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
): Order => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order: Order = {
        id: generateOrderId(),
        userId,
        items,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString()
    };

    saveOrder(order);
    return order;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (userId: string, orderId: string, status: Order['status']): Order | null => {
    const orders = getOrders(userId);
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex >= 0) {
        orders[orderIndex].status = status;
        localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
        return orders[orderIndex];
    }

    return null;
};

// Xử lý thanh toán
export const processPayment = async (
    order: Order,
    paymentDetails: any
): Promise<{ success: boolean; message: string }> => {
    try {
        // Giả lập xử lý thanh toán
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Trong thực tế, đây sẽ là nơi gọi API thanh toán
        const success = Math.random() > 0.1; // 90% tỷ lệ thành công

        if (success) {
            updateOrderStatus(order.userId, order.id, 'processing');
            return {
                success: true,
                message: 'Thanh toán thành công! Đơn hàng của bạn đang được xử lý.'
            };
        } else {
            return {
                success: false,
                message: 'Thanh toán thất bại. Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.'
        };
    }
};

// Tạo ID đơn hàng ngẫu nhiên
const generateOrderId = (): string => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Lấy danh sách đơn hàng từ localStorage
const getOrdersFromStorage = (): Order[] => {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
};

// Lưu danh sách đơn hàng vào localStorage
const saveOrdersToStorage = (orders: Order[]) => {
    localStorage.setItem('orders', JSON.stringify(orders));
};

// Tạo đơn hàng mới
export const createOrderAsync = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const orders = getOrdersFromStorage();
    const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
    };

    orders.push(newOrder);
    saveOrdersToStorage(orders);

    return newOrder;
};

// Lấy danh sách đơn hàng của người dùng
export const getOrdersAsync = async (userId: string): Promise<Order[]> => {
    const orders = getOrdersFromStorage();
    return orders.filter(order => order.userId === userId);
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    const orders = getOrdersFromStorage();
    return orders.find(order => order.id === orderId) || null;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatusAsync = async (orderId: string, status: Order['status']): Promise<Order | null> => {
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) return null;

    orders[orderIndex] = {
        ...orders[orderIndex],
        status
    };

    saveOrdersToStorage(orders);
    return orders[orderIndex];
}; 