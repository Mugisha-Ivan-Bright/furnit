import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryBar from './components/CategoryBar';
import ProductGrid from './components/ProductGrid';
import Showcase from './components/Showcase';
import FAQ from './components/FAQ';
import Locations from './components/Locations';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import PageLoader from './components/PageLoader';
import LoadingOverlay from './components/LoadingOverlay';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function Home({ onAddToCart, cartItems, onRemove }) {
    return (
        <>
            <div id="hero">
                <Hero />
            </div>
            <div id="catalog">
                <CategoryBar />
                <ProductGrid onAddToCart={onAddToCart} cartItems={cartItems} onRemove={onRemove} />
            </div>
            <div id="featured">
                <Showcase />
            </div>
            <section className="py-24 bg-background px-6 transition-colors duration-500">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { title: 'Free Shipping', desc: 'On all orders over $1000', icon: '🚚' },
                        { title: 'Return Policy', desc: '30 days easy return', icon: '🔄' },
                        { title: 'Secure Payment', desc: '100% secure payment gateway', icon: '🔒' },
                        { title: 'Customer Support', desc: '24/7 dedicated support', icon: '🎧' }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] hover:bg-soft transition-all duration-500 border border-transparent hover:border-soft/20">
                            <span className="text-4xl">{feature.icon}</span>
                            <h4 className="text-xl font-bold text-dark">{feature.title}</h4>
                            <p className="text-dark-light text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <FAQ />
            <Locations />
        </>
    );
}

function AppContent({ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const hideFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            // Store the intended action and redirect to login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            sessionStorage.setItem('loginMessage', 'Please login to add items to your cart');
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="min-h-screen bg-background selection:bg-accent selection:text-white flex flex-col transition-colors duration-500">
            <CustomCursor />
            <PageLoader />
            <LoadingOverlay />
            <Navbar cartCount={cartCount} />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home onAddToCart={handleAddToCart} cartItems={cartItems} onRemove={removeFromCart} />} />
                    <Route path="/products" element={<Products onAddToCart={handleAddToCart} cartItems={cartItems} onRemove={removeFromCart} />} />
                    <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} cartItems={cartItems} onRemove={removeFromCart} />} />
                    <Route path="/dashboard" element={<Dashboard onAddToCart={handleAddToCart} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/help" element={<Documentation />} />
                    <Route path="/cart" element={<Cart
                        cartItems={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                    />} />
                    <Route path="/checkout" element={<Checkout
                        cartItems={cartItems}
                        onClearCart={clearCart}
                    />} />
                </Routes>
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
}

function App() {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <AppContent
                        cartItems={cartItems}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        cartCount={cartCount}
                    />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
