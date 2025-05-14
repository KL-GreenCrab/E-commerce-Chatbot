import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const { user, isAuthReady } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthReady && user?.role === 'admin' && id) {
            const auth = localStorage.getItem('auth');
            const token = auth ? JSON.parse(auth).token : null;
            axios.get(`http://localhost:5000/api/admin/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    const found = res.data.find((o: any) => o._id === id);
                    setOrder(found);
                    setEditData(found);
                })
                .finally(() => setLoading(false));
        }
    }, [id, user, isAuthReady]);

    if (!isAuthReady) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Không có quyền truy cập</div>;
    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const auth = localStorage.getItem('auth');
            const token = auth ? JSON.parse(auth).token : null;
            await axios.put(`http://localhost:5000/api/admin/orders/${id}`, editData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Cập nhật đơn hàng thành công!');
            navigate('/admin/orders');
        } catch (error) {
            toast.error('Có lỗi khi cập nhật đơn hàng');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                    name="status"
                    value={editData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
                <input
                    type="number"
                    name="total"
                    value={editData.total}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                <input
                    type="text"
                    name="paymentMethod"
                    value={editData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            {/* Có thể bổ sung chỉnh sửa shippingAddress, items nếu muốn */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Lưu thay đổi
                </button>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage; 