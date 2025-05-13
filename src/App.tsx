import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import { Cart } from './components/Cart/Cart';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import CategoryPage from './components/Categories/CategoryPage';
import { UserProfile } from './components/User/UserProfile';
import Footer from './components/Footer';
import { Checkout } from './components/Checkout/Checkout';
import { OrderSuccess } from './components/Checkout/OrderSuccess';
import { OrderList } from './components/Orders/OrderList';
import CartPage from './components/Cart/CartPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { AuthProvider } from './hooks/useAuth';
import { CartItem, Product, OrderData } from './types';
import { fetchProducts } from './services/productService';

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
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, {
        id: Date.now(),
        productId: product._id,
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
      handleRemoveItem(id.toString());
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
      icon: '🗑️',
      duration: 2000,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    setSelectedPriceRange({ min, max });
  };

  // Filter products based on selected criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      product.category === selectedCategory;

    const matchesBrand = !selectedBrand ||
      product.brand === selectedBrand;

    const matchesPrice = !selectedPriceRange ||
      (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max);

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Get search results based on query parameter
  const getSearchResults = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async (orderData: OrderData) => {
    try {
      setCartItems([]);
      localStorage.removeItem('cart');
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      throw error;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
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
            products={products}
            cartItems={cartItems}
            onCartClick={() => setIsCartOpen(true)}
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            onBrandSelect={handleBrandSelect}
            onPriceRangeSelect={handlePriceRangeSelect}
          />

          <main className="flex-grow pt-16">
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
                <Route path="/search" element={
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <section>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getSearchResults().map(product => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </section>
                  </main>
                } />
                <Route path="/checkout" element={
                  <Checkout
                    cartItems={cartItems}
                    total={getTotal()}
                    onPlaceOrder={handlePlaceOrder}
                  />
                } />
                <Route path="/order-success" element={<OrderSuccess />} />
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
                          {filteredProducts.map(product => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              onAddToCart={handleAddToCart}
                            />
                          ))}
                        </div>
                      </section>
                    </main>
                  </>
                } />
                <Route path="/profile/orders" element={<OrderList />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/cart/:userId" element={<CartPage />} />
              </Routes>
            </PageTransition>
          </main>

          <Footer />

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
