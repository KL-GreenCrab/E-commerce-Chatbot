import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface SearchSuggestionsProps {
    suggestions: Product[];
    onSelect: (product: Product) => void;
    isLoading?: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    onSelect,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-50">
                <div className="p-4 text-center text-gray-500">Loading...</div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-50">
                <div className="p-4 text-center text-gray-500">No products found</div>
            </div>
        );
    }

    return (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-50 max-h-96 overflow-y-auto">
            {suggestions.map((product) => (
                <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={() => onSelect(product)}
                    className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}; 