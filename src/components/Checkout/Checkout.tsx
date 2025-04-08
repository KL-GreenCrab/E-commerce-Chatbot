import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { createOrderAsync } from '../../services/orderService';
import { SavedCards } from './SavedCards';
import { AddCardForm } from './AddCardForm';
import { toast } from 'react-hot-toast';
import { CreditCard, Plus, Loader } from 'lucide-react';
import { CartItem } from '../../types';
import { SavedCard } from '../../services/cardService';

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, getTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            toast.error('Giỏ hàng trống');
            navigate('/cart');
        }
    }, [user, cart, navigate]);

    const handleCardSelect = (card: SavedCard) => {
        setSelectedCardId(card.id);
    };

    const handleAddCardSuccess = () => {
        setShowAddCard(false);
        toast.success('Thẻ đã được thêm thành công');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        if (!selectedCardId) {
            toast.error('Vui lòng chọn thẻ thanh toán');
            return;
        }

        setIsSubmitting(true);

        try {
            const order = await createOrderAsync({
                userId: user.id,
                items: cart,
                total: getTotal(),
                paymentMethod: 'credit_card',
                paymentStatus: 'pending',
                shippingAddress: {
                    fullName: user.name,
                    address: '123 Main St',
                    city: 'Ho Chi Minh City',
                    state: 'Ho Chi Minh',
                    zipCode: '700000',
                    phone: '0123456789'
                }
            });

            clearCart();
            toast.success('Đặt hàng thành công!');
            navigate(`/orders/${order.id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        {cart.map((item: CartItem) => (
                            <div key={item.id} className="flex justify-between py-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{item.price.toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Tổng cộng:</span>
                                <span>{getTotal().toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

                    {!showAddCard ? (
                        <>
                            <SavedCards
                                onSelectCard={handleCardSelect}
                                onAddNewCard={() => setShowAddCard(true)}
                            />

                            <button
                                onClick={() => setShowAddCard(true)}
                                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm thẻ mới
                            </button>
                        </>
                    ) : (
                        <AddCardForm
                            onCancel={() => setShowAddCard(false)}
                            onSuccess={handleAddCardSuccess}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedCardId}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Thanh toán
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}; 