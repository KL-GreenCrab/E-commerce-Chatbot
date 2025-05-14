import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { getOrderById, confirmOrderDelivery } from '../../services/orderService';
import { toast } from 'react-hot-toast';

export const OrderDetail: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (orderId) {
            const orderData = getOrderById(orderId);
            setOrder(orderData);
            setIsLoading(false);
        }
    }, [orderId]);

    const handleConfirmDelivery = () => {
        if (!orderId) return;

        setIsConfirming(true);
        try {
            const updatedOrder = confirmOrderDelivery(orderId);
            if (updatedOrder) {
                setOrder(updatedOrder);
                toast.success('Đã xác nhận nhận hàng thành công!');
            } else {
                toast.error('Không thể xác nhận đơn hàng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error confirming delivery:', error);
            toast.error('Đã xảy ra lỗi khi xác nhận đơn hàng.');
        } finally {
            setIsConfirming(false);
        }
    };

    if (isLoading) {
        return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
                    <Link
                        to="/profile/orders"
                        className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                <Link
                    to="/profile/orders"
                    className="text-red-600 hover:text-red-700"
                >
                    Quay lại danh sách đơn hàng
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="font-semibold">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ngày đặt</p>
                            <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Trạng thái</p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Họ và tên</p>
                            <p className="font-medium">{order.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{order.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{order.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Thành phố</p>
                            <p className="font-medium">{order.city}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                            <p className="font-medium">{order.address}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.productId} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x {formatPrice(item.price)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                            <p className="font-medium">
                                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng cộng</p>
                            <p className="text-2xl font-bold text-red-600">
                                {formatPrice(order.total)}
                            </p>
                        </div>
                    </div>

                    {order.status === 'shipped' && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleConfirmDelivery}
                                disabled={isConfirming}
                                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isConfirming ? 'Đang xác nhận...' : 'Xác nhận đã nhận hàng'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 