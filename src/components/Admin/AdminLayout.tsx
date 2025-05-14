import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardStats } from '../../services/adminService';
import { toast } from 'react-toastify';

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
}

export default function AdminLayout() {
    const { user, isAuthReady } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthReady && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, navigate, isAuthReady]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                toast.error('Không thể tải thống kê');
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthReady && user?.role === 'admin') {
            fetchStats();
        }
    }, [user, isAuthReady]);

    if (!isAuthReady) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/admin" className="text-xl font-bold text-red-600">
                                    Admin Dashboard
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/admin/products"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/admin/add-product"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Add Product
                                </Link>
                                <Link
                                    to="/admin/orders"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


        </div>
    );
} 