import React from 'react';
import { X, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';

interface ProductSelectorProps {
    products: Product[];
    selectedProducts: Product[];
    currentProduct: Product;
    onSelect: (product: Product) => void;
    onDeselect: (product: Product) => void;
    onClose: () => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
    products,
    selectedProducts,
    currentProduct,
    onSelect,
    onDeselect,
    onClose
}) => {
    const similarProducts = products.filter(p =>
        p._id !== currentProduct._id &&
        p.category === currentProduct.category
    );

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Chọn sản phẩm để so sánh</h1>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProducts.map(product => {
                        const isSelected = selectedProducts.some(p => p._id === product._id);

                        return (
                            <div
                                key={product._id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-red-500' : 'hover:shadow-lg'
                                    }`}
                                onClick={() => isSelected ? onDeselect(product) : onSelect(product)}
                            >
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                                    <p className="text-red-600 font-semibold">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        Đã chọn {selectedProducts.length} sản phẩm để so sánh
                    </p>
                    <button
                        onClick={onClose}
                        disabled={selectedProducts.length === 0}
                        className={`px-6 py-3 rounded-lg ${selectedProducts.length > 0
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        So sánh ({selectedProducts.length + 1} sản phẩm)
                    </button>
                </div>
            </div>
        </div>
    );
}; 