import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Edit, Save, X, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
                    <Link
                        to="/login"
                        className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // In a real app, you would update the user profile in the backend
        toast.success('Thông tin đã được cập nhật');
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất thành công');
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Họ và tên</p>
                            <p className="font-medium">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{user.phone}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link
                            to="/profile/orders"
                            className="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Xem đơn hàng của tôi</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}; 