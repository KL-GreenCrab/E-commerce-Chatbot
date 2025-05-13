import React from 'react';
import { X, Star, ShoppingCart, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';

interface ProductComparisonProps {
    products: Product[];
    onClose: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ products, onClose }) => {
    const specifications = products.reduce((acc, product) => {
        if (product.specifications) {
            Object.keys(product.specifications).forEach(key => {
                if (!acc.includes(key)) {
                    acc.push(key);
                }
            });
        }
        return acc;
    }, [] as string[]);

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">So sánh sản phẩm</h1>
                        <p className="text-gray-500 mt-1">So sánh chi tiết các sản phẩm đã chọn</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Product Cards */}
                    <div className="grid grid-cols-4 gap-6 p-6 border-b">
                        <div className="font-semibold text-gray-900 text-lg">Sản phẩm</div>
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                className={`relative ${index !== products.length - 1 ? 'border-r border-gray-200' : ''}`}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-32 h-32 object-contain mx-auto transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 text-center">{product.name}</h3>
                                    <p className="text-gray-600 mb-2 text-center">{product.brand}</p>

                                    <div className="flex items-center justify-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({product.reviews} đánh giá)
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-red-600 font-bold text-xl text-center">
                                            {formatPrice(product.price)}
                                        </p>
                                        {product.originalPrice && (
                                            <p className="text-gray-400 line-through text-sm text-center">
                                                {formatPrice(product.originalPrice)}
                                            </p>
                                        )}
                                    </div>

                                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="divide-y divide-gray-200">
                        {/* Basic Info */}
                        <div className="grid grid-cols-4 gap-6 p-6 bg-gray-50">
                            <div className="font-semibold text-gray-900">Thông số cơ bản</div>
                            {products.map(product => (
                                <div key={product._id} className="text-gray-600 space-y-2">
                                    <div className="flex items-center h-8">
                                        <span className="font-medium text-gray-700 mr-2">Thương hiệu:</span>
                                        <span>{product.brand}</span>
                                    </div>
                                    <div className="flex items-center h-8">
                                        <span className="font-medium text-gray-700 mr-2">Danh mục:</span>
                                        <span>{product.category}</span>
                                    </div>
                                    <div className="flex items-center h-8">
                                        <span className="font-medium text-gray-700 mr-2">Tình trạng:</span>
                                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Specifications */}
                        {specifications.map((spec, index) => (
                            <div
                                key={spec}
                                className={`grid grid-cols-4 gap-6 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="font-semibold text-gray-900">{spec}</div>
                                {products.map(product => (
                                    <div key={product._id} className="text-gray-600 flex items-center h-8">
                                        {product.specifications?.[spec] || '-'}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Description */}
                        <div className="grid grid-cols-4 gap-6 p-6 bg-white">
                            <div className="font-semibold text-gray-900">Mô tả sản phẩm</div>
                            {products.map(product => (
                                <div key={product._id} className="text-gray-600">
                                    <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm leading-relaxed">
                                            {product.description || '-'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 