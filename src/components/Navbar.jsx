import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, Sun, Moon, LogOut, Settings, Package, Heart, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Scroll Spy for Home Page Sections
    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sectionIds = ['hero', 'catalog', 'featured', 'faq', 'locations'];
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [location.pathname]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setSearchOpen(false);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-dark hover:text-accent transition-colors">
                        furnit.
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-dark/70">
                        <button
                            onClick={() => scrollToSection('catalog')}
                            className={`hover:text-dark transition-colors ${activeSection === 'catalog' ? 'text-accent font-bold' : ''}`}
                        >
                            Catalog
                        </button>
                        <button
                            onClick={() => scrollToSection('featured')}
                            className={`hover:text-dark transition-colors ${activeSection === 'featured' ? 'text-accent font-bold' : ''}`}
                        >
                            Collections
                        </button>
                        <Link
                            to="/products"
                            className={`hover:text-dark transition-colors ${location.pathname === '/products' ? 'text-accent font-bold' : ''}`}
                        >
                            Products
                        </Link>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className={`hover:text-dark transition-colors ${activeSection === 'faq' ? 'text-accent font-bold' : ''}`}
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => scrollToSection('locations')}
                            className={`hover:text-dark transition-colors ${activeSection === 'locations' ? 'text-accent font-bold' : ''}`}
                        >
                            Locations
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Bar */}
                    <AnimatePresence>
                        {searchOpen ? (
                            <motion.form
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSearchSubmit}
                                className="hidden sm:flex items-center overflow-hidden"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    autoFocus
                                    className="w-64 bg-soft border-none px-4 py-2 rounded-l-full text-sm focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="bg-soft px-4 py-2 rounded-r-full text-dark hover:text-accent transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setSearchOpen(true)}
                                className="hidden sm:block p-2 text-dark hover:text-accent transition-colors"
                            >
                                <Search size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <Link
                        to="/cart"
                        className={`relative p-2 transition-colors ${location.pathname === '/cart' ? 'text-accent' : 'text-dark hover:text-accent'}`}
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-0 right-0 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-dark hover:text-accent transition-all duration-300 transform hover:rotate-12"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                    </button>

                    {!isAuthenticated && (
                        <Link
                            to="/login"
                            className={`hidden sm:block p-2 transition-colors ${location.pathname === '/login' || location.pathname === '/signup' ? 'text-accent' : 'text-dark hover:text-accent'}`}
                        >
                            <User size={20} />
                        </Link>
                    )}
                    {!isAuthenticated && (
                        <Link
                            to="/login"
                            className={`hidden md:block px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${location.pathname === '/login' || location.pathname === '/signup'
                                ? 'bg-accent text-white'
                                : 'bg-dark text-white dark:text-night hover:bg-accent hover:text-white'
                                }`}
                        >
                            Sign In
                        </Link>
                    )}

                    {/* User Dropdown Menu */}
                    {isAuthenticated && (
                        <div className="hidden sm:block relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-2 rounded-full hover:bg-soft transition-all"
                            >
                                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <ChevronDown size={16} className={`text-dark transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-card rounded-2xl shadow-2xl border border-soft overflow-hidden z-50"
                                    >
                                        {/* User Info */}
                                        <div className="p-4 border-b border-soft bg-soft/50">
                                            <p className="font-bold text-dark truncate">
                                                {user?.user_metadata?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs text-dark/60 truncate">{user?.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-soft transition-colors"
                                            >
                                                <User size={18} />
                                                <span className="text-sm font-medium">Dashboard</span>
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-soft transition-colors"
                                            >
                                                <Package size={18} />
                                                <span className="text-sm font-medium">My Orders</span>
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-soft transition-colors"
                                            >
                                                <Heart size={18} />
                                                <span className="text-sm font-medium">Wishlist</span>
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-soft transition-colors"
                                            >
                                                <Settings size={18} />
                                                <span className="text-sm font-medium">Settings</span>
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-soft">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut size={18} />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-dark hover:text-accent transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-card z-50 shadow-2xl transition-colors duration-500"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-soft">
                                    <h3 className="text-2xl font-serif font-bold text-dark">Menu</h3>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 text-dark hover:text-accent transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {/* Search Bar Mobile */}
                                    <form onSubmit={handleSearchSubmit} className="mb-6">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full bg-soft border-none px-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white p-2.5 rounded-xl hover:bg-dark transition-colors"
                                            >
                                                <Search size={16} />
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-2 mb-8">
                                        <button
                                            onClick={() => scrollToSection('catalog')}
                                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeSection === 'catalog' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            Catalog
                                        </button>
                                        <button
                                            onClick={() => scrollToSection('featured')}
                                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeSection === 'featured' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            Collections
                                        </button>
                                        <Link
                                            to="/products"
                                            onClick={handleLinkClick}
                                            className={`block w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === '/products' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            All Products
                                        </Link>
                                        <button
                                            onClick={() => scrollToSection('faq')}
                                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeSection === 'faq' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            FAQ
                                        </button>
                                        <button
                                            onClick={() => scrollToSection('locations')}
                                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeSection === 'locations' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            Locations
                                        </button>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="space-y-3 pt-6 border-t border-soft">
                                        <Link
                                            to="/cart"
                                            onClick={handleLinkClick}
                                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/cart' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                }`}
                                        >
                                            <ShoppingCart size={20} />
                                            <span className="font-bold">Cart</span>
                                            {cartCount > 0 && (
                                                <span className="ml-auto bg-accent text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                        {!isAuthenticated && (
                                            <Link
                                                to="/login"
                                                onClick={handleLinkClick}
                                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/login' || location.pathname === '/signup' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                    }`}
                                            >
                                                <User size={20} />
                                                <span className="font-bold">Account</span>
                                            </Link>
                                        )}
                                        {isAuthenticated && (
                                            <>
                                                <Link
                                                    to="/dashboard"
                                                    onClick={handleLinkClick}
                                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/dashboard' ? 'bg-accent/10 text-accent' : 'text-dark hover:bg-soft'
                                                        }`}
                                                >
                                                    <User size={20} />
                                                    <span className="font-bold">Dashboard</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-red-600 hover:bg-red-50 w-full"
                                                >
                                                    <LogOut size={20} />
                                                    <span className="font-bold">Logout</span>
                                                </button>
                                            </>
                                        )}
                                        {/* Mobile Theme Toggle */}
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-dark hover:bg-soft w-full"
                                        >
                                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                                            <span className="font-bold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Footer */}
                                {!isAuthenticated && (
                                    <div className="p-6 border-t border-soft">
                                        <Link
                                            to="/login"
                                            onClick={handleLinkClick}
                                            className="block w-full bg-dark text-white dark:text-night text-center py-4 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all"
                                        >
                                            Sign In
                                        </Link>
                                        <p className="text-center text-sm text-dark/40 mt-4">
                                            New here? <Link to="/signup" onClick={handleLinkClick} className="text-accent font-bold">Create Account</Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
