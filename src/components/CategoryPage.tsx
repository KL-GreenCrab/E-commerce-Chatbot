import React from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '../data/products';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface CategoryPageProps {
  onAddToCart: (product: Product) => void;
}

export default function CategoryPage({ onAddToCart }: CategoryPageProps) {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => 
    p.category.toLowerCase() === (category?.name.toLowerCase() || '')
  );

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="relative h-64 bg-gray-900">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-lg text-gray-200">{category.description}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}