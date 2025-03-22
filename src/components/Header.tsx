import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import { CartItem } from '../types';
import { categories } from '../data/products';
import SearchBar from './SearchBar';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

export default function Header({ cartItems, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            <div className="flex-1 max-w-2xl">
              <SearchBar onProductSelect={(product) => navigate(`/product/${product.id}`)} />
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <User className="h-6 w-6 text-gray-700" />
              </Link>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full relative"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}