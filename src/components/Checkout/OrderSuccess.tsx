import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã mua hàng. Chúng tôi sẽ gửi email xác nhận đơn hàng của bạn trong thời gian sớm nhất.
                </p>

                {orderId && (
                    <p className="text-gray-600 mb-8">
                        Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                    </p>
                )}

                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="block w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Xem đơn hàng
                    </Link>

                    <Link
                        to="/products"
                        className="block w-full py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}; 