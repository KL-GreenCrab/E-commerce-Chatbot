import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import CategoryPage from './components/CategoryPage';
import { UserProfile } from './components/User/UserProfile';

import { AuthProvider } from './hooks/useAuth';
import { products } from './data/products';
import { CartItem, Product } from './types';

// Wrapper component to handle page transitions
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fadeIn">
      {children}
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart items from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart items to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });

    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
      duration: 2000,
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removed from cart', {
      icon: '🗑️',
      duration: 2000,
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Header
            cartItems={cartItems}
            onCartClick={() => setIsCartOpen(true)}
          />

          <PageTransition>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/product/:id" element={
                <ProductDetail onAddToCart={handleAddToCart} />
              } />
              <Route path="/category/:categoryId" element={
                <CategoryPage onAddToCart={handleAddToCart} />
              } />
              <Route path="/" element={
                <>
                  <Hero />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <section>
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                        <button className="text-red-600 hover:text-red-700">View All</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </section>
                  </main>
                </>
              } />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </PageTransition>

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
