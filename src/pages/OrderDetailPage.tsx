import React from 'react';
import { OrderDetail } from '../components/Orders/OrderDetail';

const OrderDetailPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Xem thông tin chi tiết về đơn hàng của bạn
                    </p>
                </div>
                <OrderDetail />
            </div>
        </div>
    );
};

export default OrderDetailPage; 