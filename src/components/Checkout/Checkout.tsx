import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/format';
import { CartItem } from '../../types';
import { createOrder } from '../../services/orderService';
import { getUser } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';

interface CheckoutProps {
    cartItems: CartItem[];
    total: number;
    onPlaceOrder: (orderData: OrderData) => Promise<void>;
}

interface OrderData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: 'cod' | 'bank' | 'credit_card';
    note?: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ cartItems, total, onPlaceOrder }) => {
    const { user } = useAuth();
    const { clear } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState<OrderData>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'cod',
        note: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?._id) {
                try {
                    setIsLoading(true);
                    const userData = await getUser(user._id);
                    setFormData(prev => ({
                        ...prev,
                        fullName: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        address: userData.address,
                        city: userData.city || ''
                    }));
                } catch (error) {
                    toast.error('Không thể lấy thông tin người dùng');
                    console.error('Error fetching user data:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user?._id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        try {
            const order = await createOrder({
                items: cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity
                })),
                total,
                paymentMethod: formData.paymentMethod === 'cod'
                    ? 'cash_on_delivery'
                    : formData.paymentMethod === 'bank'
                        ? 'bank_transfer'
                        : 'credit_card',
                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    state: formData.city,
                    zipCode: '000000',
                    phone: formData.phone
                }
            });
            await clear();
            toast.success('Đặt hàng thành công!');
            navigate('/order-success', { state: { orderId: order._id } });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form thanh toán */}
                <div className="lg:col-span-2">
                    {!showConfirm ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thành phố
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500"
                                        />
                                        <span>Thanh toán khi nhận hàng (COD)</span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="bank"
                                            checked={formData.paymentMethod === 'bank'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500"
                                        />
                                        <span>Chuyển khoản ngân hàng</span>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4">Thanh toán</button>
                        </form>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4">Xác nhận thông tin đặt hàng</h2>
                            <div className="space-y-2">
                                <div><strong>Họ và tên:</strong> {formData.fullName}</div>
                                <div><strong>Email:</strong> {formData.email}</div>
                                <div><strong>Số điện thoại:</strong> {formData.phone}</div>
                                <div><strong>Thành phố:</strong> {formData.city}</div>
                                <div><strong>Địa chỉ:</strong> {formData.address}</div>
                                <div><strong>Ghi chú:</strong> {formData.note}</div>
                                <div><strong>Phương thức thanh toán:</strong> {formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : formData.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'Credit Card'}</div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleConfirmOrder} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                                </button>
                                <button onClick={() => setShowConfirm(false)} disabled={isSubmitting} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                    Quay lại chỉnh sửa
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Tạm tính:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Tổng cộng:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 