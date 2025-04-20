import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>

                <p className="text-gray-600 mb-8">
                    Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Xem đơn hàng của tôi
                    </Link>

                    <div>
                        <Link
                            to="/"
                            className="text-red-600 hover:text-red-700"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 