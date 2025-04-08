import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types';
import { getOrdersAsync } from '../../services/orderService';
import { formatCurrency } from '../../utils/format';

export const OrderList: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                const userOrders = await getOrdersAsync(user.id);
                setOrders(userOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-green-100 text-green-800'
                            }`}>
                            {order.status === 'pending' ? 'Chờ xử lý' :
                                order.status === 'processing' ? 'Đang xử lý' :
                                    order.status === 'cancelled' ? 'Đã hủy' :
                                        'Đã hoàn thành'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Số lượng: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Phương thức thanh toán: {
                                        order.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' :
                                            order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' :
                                                'Thanh toán khi nhận hàng'
                                    }
                                </p>
                                <p className="text-sm text-gray-500">
                                    Địa chỉ giao hàng: {order.shippingAddress.address}, {order.shippingAddress.city}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng tiền</p>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 