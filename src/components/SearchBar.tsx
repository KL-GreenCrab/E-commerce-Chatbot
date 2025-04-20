import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Product, SearchFilters } from '../types';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';

interface SearchBarProps {
  onProductSelect: (product: Product) => void;
}

export default function SearchBar({ onProductSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 5000],
    brands: [],
    categories: [],
    rating: 0
  });

  const searchRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesBrand = filters.brands.length === 0 ||
      filters.brands.includes(product.brand);
    const matchesCategory = filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const matchesRating = product.rating >= filters.rating;

    return matchesQuery && matchesPrice && matchesBrand && matchesCategory && matchesRating;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search products..."
          className="w-full md:w-96 px-4 py-2 pl-10 pr-12 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-2 p-1 hover:bg-gray-200 rounded-full"
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {showFilters && (
        <div className="absolute top-12 right-0 w-72 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]]
                })}
                className="w-24 px-2 py-1 border rounded"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)]
                })}
                className="w-24 px-2 py-1 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Minimum Rating</h3>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onChange={(e) => setFilters({
                ...filters,
                rating: Number(e.target.value)
              })}
              className="w-full"
            />
            <span>{filters.rating} stars</span>
          </div>

          <button
            onClick={() => setFilters({
              priceRange: [0, 5000],
              brands: [],
              categories: [],
              rating: 0
            })}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {showResults && query && (
        <div className="absolute top-12 left-0 right-0 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {filteredProducts.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    onProductSelect(product);
                    setShowResults(false);
                    setQuery('');
                  }}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}