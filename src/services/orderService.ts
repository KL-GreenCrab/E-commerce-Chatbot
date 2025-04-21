import { CartItem, Order, OrderData } from '../types';

const ORDER_STORAGE_KEY = 'orders';

export const saveOrder = (orderData: OrderData, items: CartItem[], total: number, userId: string): Order => {
    const orders = getOrders();
    const newOrder: Order = {
        id: Date.now().toString(),
        userId,
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        total,
        items,
        shippingAddress: {
            fullName: orderData.fullName,
            address: orderData.address,
            city: orderData.city,
            state: '',
            zipCode: '',
            phone: orderData.phone
        },
        paymentMethod: orderData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'bank_transfer',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
};

export const getOrders = (): Order[] => {
    const ordersJson = localStorage.getItem(ORDER_STORAGE_KEY);
    return ordersJson ? JSON.parse(ordersJson) : [];
};

export const getOrderById = (orderId: string): Order | undefined => {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
};

// Tạo đơn hàng mới
export const createOrder = (
    orderData: OrderData & { userId: string },
    items: CartItem[]
): Order => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order: Order = {
        id: generateOrderId(),
        userId: orderData.userId,
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        total,
        items,
        shippingAddress: {
            fullName: orderData.fullName,
            address: orderData.address,
            city: orderData.city,
            state: '',
            zipCode: '',
            phone: orderData.phone
        },
        paymentMethod: orderData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'bank_transfer',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
    };
    saveOrder(orderData, items, total, order.userId);
    return order;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (userId: string, orderId: string, status: Order['status']): Order | null => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex >= 0) {
        orders[orderIndex].status = status;
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
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
    const orders = localStorage.getItem(ORDER_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
};

// Lưu danh sách đơn hàng vào localStorage
const saveOrdersToStorage = (orders: Order[]) => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
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
    const orders = getOrdersFromStorage() as unknown as Order[];
    return orders.filter(order => order.userId === userId);
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

export const confirmOrderDelivery = (orderId: string): Order | null => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex >= 0) {
        orders[orderIndex].status = 'delivered';
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
        return orders[orderIndex];
    }

    return null;
}; 