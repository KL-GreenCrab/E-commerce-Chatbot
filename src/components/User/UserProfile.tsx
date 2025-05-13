import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Edit, Save, X, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUser, updateUser } from '../../services/userService';

export const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?._id) {
            setLoading(true);
            getUser(user._id)
                .then(data => setFormData({ name: data.name, email: data.email, address: data.address }))
                .catch(() => toast.error('Không lấy được thông tin tài khoản'))
                .finally(() => setLoading(false));
        }
    }, [user?._id]);

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

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateUser(user._id, {
                name: formData.name,
                phone: user.phone,
                address: formData.address
            });
            toast.success('Thông tin đã được cập nhật');
            setIsEditing(false);
        } catch {
            toast.error('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
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
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            ) : (
                                <p className="font-medium">{formData.name}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{formData.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{user.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Địa chỉ</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            ) : (
                                <p className="font-medium">{formData.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
                                    disabled={loading}
                                >
                                    <Save className="w-4 h-4" /> Lưu
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" /> Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
                            >
                                <Edit className="w-4 h-4" /> Chỉnh sửa
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1 ml-auto"
                        >
                            <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
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