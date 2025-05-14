import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { CartProvider } from './hooks/CartProvider';
import { CartItem, Product, OrderData } from './types';
import { fetchProducts } from './services/productService';
import AdminLayout from './components/Admin/AdminLayout';
import AddProduct from './components/Admin/AddProduct';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { Chatbot } from './components/Chatbot';

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

  return (
    <AuthProvider>
      <CartProvider>
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
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/search" element={
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {getSearchResults().map(product => (
                            <ProductCard
                              key={product._id}
                              product={product}
                            />
                          ))}
                        </div>
                      </section>
                    </main>
                  } />
                  <Route path="/checkout" element={<CheckoutPage />} />
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
                              />
                            ))}
                          </div>
                        </section>
                      </main>
                    </>
                  } />
                  <Route path="/profile/orders" element={<OrderList />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/cart/:userId" element={<CartPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    {/* KHÔNG có route con add-product ở đây */}
                  </Route>
                  <Route
                    path="/admin/add-product"
                    element={
                      <AdminRoute>
                        <AdminAddProductPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <AdminOrderListPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/:id"
                    element={
                      <AdminRoute>
                        <AdminOrderDetailPage />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </PageTransition>
            </main>

            <Footer />

            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            <Chatbot />

            <ToastContainer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
