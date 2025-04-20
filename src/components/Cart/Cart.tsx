import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { CartItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) => {
    const { user } = useAuth();

    if (!isOpen) return null;

    const getTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const isEmpty = items.length === 0;

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách sản phẩm */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {isEmpty ? (
                                <div className="p-8 text-center">
                                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
                                    <p className="text-gray-500 mb-4">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                                    <Link
                                        to="/"
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {items.map(item => (
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
                                                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="w-8 text-center">{item.quantity}</span>

                                                <button
                                                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <p className="font-semibold">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                                <button
                                                    onClick={() => onRemoveItem(item.productId)}
                                                    className="text-red-500 hover:text-red-600 mt-2 flex items-center gap-1"
                                                    title="Xóa sản phẩm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm">Xóa</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tổng tiền và thanh toán */}
                    {!isEmpty && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(getTotal())}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span>Miễn phí</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-semibold">
                                            <span>Tổng cộng:</span>
                                            <span>{formatPrice(getTotal())}</span>
                                        </div>
                                    </div>
                                </div>
                                {user ? (
                                    <Link
                                        to="/checkout"
                                        className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg text-center hover:bg-red-700 transition-colors"
                                    >
                                        Thanh toán
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg text-center hover:bg-red-700 transition-colors"
                                    >
                                        Đăng nhập để thanh toán
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 