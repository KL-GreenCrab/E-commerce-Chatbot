import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, X, Filter } from 'lucide-react';
import { CartItem } from '../types';
import { categories, products } from '../data/products';
import { SearchBar } from './SearchBar';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onBrandSelect?: (brand: string) => void;
  onPriceRangeSelect?: (min: number, max: number) => void;
}

const priceRanges = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000 - $2000', min: 1000, max: 2000 },
  { label: 'Over $2000', min: 2000, max: Infinity }
];

const brands = Array.from(new Set(products.map(product => product.brand)));

export default function Header({
  cartItems,
  onCartClick,
  onSearch,
  onCategorySelect,
  onBrandSelect,
  onPriceRangeSelect
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [priceSliderValue, setPriceSliderValue] = useState<[number, number]>([0, 3000]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const minPrice = useMemo(() => Math.min(...products.map(p => p.price)), []);
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price)), []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setIsCategoryDropdownOpen(false);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    navigate(`/category/${categoryId}`);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    if (onBrandSelect) {
      onBrandSelect(brand);
    }
    setIsFilterDropdownOpen(false);
  };

  const handlePriceRangeSelect = (range: { min: number; max: number }) => {
    setSelectedPriceRange(range);
    setPriceSliderValue([range.min, range.max]);
    if (onPriceRangeSelect) {
      onPriceRangeSelect(range.min, range.max);
    }
    setIsFilterDropdownOpen(false);
  };

  const handlePriceSliderChange = (values: [number, number]) => {
    setPriceSliderValue(values);
    if (onPriceRangeSelect) {
      onPriceRangeSelect(values[0], values[1]);
    }
  };

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedPriceRange(null);
    setPriceSliderValue([minPrice, maxPrice]);
    if (onBrandSelect) onBrandSelect('');
    if (onPriceRangeSelect) onPriceRangeSelect(minPrice, maxPrice);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">
              TechStore
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg py-2 mt-2">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold text-gray-900">All Categories</h3>
                  </div>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </nav>

            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute top-full right-0 w-80 bg-white rounded-lg shadow-lg py-2 mt-2">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                  </div>

                  <div className="px-4 py-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brands</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => handleBrandSelect(brand)}
                          className={`w-full text-left px-2 py-1 text-sm rounded ${selectedBrand === brand ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-2 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <div className="px-2">
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={priceSliderValue[0]}
                          onChange={(e) => handlePriceSliderChange([Number(e.target.value), priceSliderValue[1]])}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={priceSliderValue[1]}
                          onChange={(e) => handlePriceSliderChange([priceSliderValue[0], Number(e.target.value)])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>${priceSliderValue[0]}</span>
                          <span>${priceSliderValue[1]}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {priceRanges.map(range => (
                          <button
                            key={range.label}
                            onClick={() => handlePriceRangeSelect(range)}
                            className={`w-full text-left px-2 py-1 text-sm rounded ${selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                              ? 'bg-red-50 text-red-600'
                              : 'hover:bg-gray-50 text-gray-700'
                              }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(selectedBrand || selectedPriceRange) && (
                    <div className="px-4 py-2 border-t">
                      <button
                        onClick={clearFilters}
                        className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <SearchBar
              onSearch={handleSearch}
              onSelect={(product) => {
                navigate(`/product/${product.id}`);
              }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-red-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <User className="h-6 w-6" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/profile/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600"
              >
                <User className="h-6 w-6" />
              </Link>
            )}

            <button
              className="md:hidden p-2 text-gray-700 hover:text-red-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleFormSubmit} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
                </h3>
                <div className="mt-2 space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Filters
                </h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <h4 className="px-3 text-sm font-medium text-gray-700 mb-2">Brands</h4>
                    <div className="space-y-1">
                      {brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => handleBrandSelect(brand)}
                          className={`block w-full text-left px-3 py-2 text-sm ${selectedBrand === brand ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="px-3 text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                    <div className="space-y-1">
                      {priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => handlePriceRangeSelect(range)}
                          className={`block w-full text-left px-3 py-2 text-sm ${selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                            ? 'bg-red-50 text-red-600'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(selectedBrand || selectedPriceRange) && (
                    <button
                      onClick={clearFilters}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}