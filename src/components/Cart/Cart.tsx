import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/format';

export const Cart: React.FC = () => {
    const { user } = useAuth();
    const {
        cart,
        isLoading,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        isEmpty
    } = useCart();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
                <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
                <Link
                    to="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Đăng nhập
                </Link>
            </div>
        );
    }

    if (isEmpty()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
                <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <Link
                    to="/products"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="divide-y">
                            {cart.map((item) => (
                                <div key={item.productId} className="p-4 flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-gray-600">{formatPrice(item.price)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                            disabled={isLoading}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <span className="w-8 text-center">{item.quantity}</span>

                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                            disabled={isLoading}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-red-500 hover:text-red-600 mt-2"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            <button
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-600 flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tổng tiền và thanh toán */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Tạm tính</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="border-t pt-2 font-semibold">
                                <div className="flex justify-between">
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(getTotal())}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center block"
                        >
                            Tiến hành thanh toán
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 