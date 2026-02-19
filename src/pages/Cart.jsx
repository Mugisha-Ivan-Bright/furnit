import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = ({ cartItems, onUpdateQuantity, onRemove }) => {
    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return acc + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-background transition-colors duration-500">
                <div className="w-24 h-24 bg-soft rounded-full flex items-center justify-center text-dark/20 mb-8">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-dark mb-4">Your cart is empty</h2>
                <p className="text-dark/40 mb-10 text-center max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="bg-dark text-white dark:text-night px-10 py-5 rounded-full font-bold hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-40 pb-24 px-6 md:px-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-[2]">
                        <h1 className="text-4xl font-serif font-bold text-dark mb-12">Shopping Cart</h1>

                        <div className="space-y-8">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center gap-8 group border border-soft/10"
                                >
                                    <Link to={`/product/${item.id}`} className="w-32 h-32 md:w-40 md:h-40 bg-soft rounded-3xl overflow-hidden flex-shrink-0 cursor-pointer">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </Link>

                                    <div className="flex-grow flex flex-col md:flex-row justify-between w-full gap-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-dark/30">{item.category}</p>
                                            <Link to={`/product/${item.id}`} className="block">
                                                <h3 className="text-xl font-bold text-dark hover:text-accent transition-colors">{item.name}</h3>
                                            </Link>
                                            <p className="text-lg font-serif font-bold text-accent">{item.price}</p>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-8">
                                            <div className="flex items-center bg-soft rounded-2xl px-2 py-1">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                    className="p-2 text-dark/40 hover:text-dark transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-12 text-center font-bold text-dark">{item.quantity}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                    className="p-2 text-dark/40 hover:text-dark transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => onRemove(item.id)}
                                                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Summary / Checkout */}
                    <div className="flex-1">
                        <div className="bg-dark text-white dark:text-night p-10 rounded-[48px] sticky top-32">
                            <h2 className="text-2xl font-serif font-bold mb-8">Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center text-white/60 dark:text-night/60">
                                    <span className="text-sm uppercase tracking-widest font-medium">Subtotal</span>
                                    <span className="font-bold text-white dark:text-night">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/60 dark:text-night/60">
                                    <span className="text-sm uppercase tracking-widest font-medium">Shipping</span>
                                    <span className="font-bold text-white dark:text-night">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                </div>
                                <div className="w-full h-px bg-white/10 dark:bg-night/10 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-serif font-bold text-accent">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 dark:text-night/40 px-1">Promo Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="ENTER CODE"
                                            className="w-full bg-white/5 dark:bg-night/5 border border-white/10 dark:border-night/10 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:border-accent transition-colors uppercase dark:text-night dark:placeholder:text-night/30"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent font-bold text-xs uppercase hover:text-white dark:hover:text-night transition-colors">Apply</button>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="w-full bg-accent text-white dark:text-night py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-dark dark:hover:bg-dark dark:hover:text-white transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-accent/20"
                                >
                                    Check Out Now <ArrowRight size={20} />
                                </Link>

                                <p className="text-[10px] text-center text-white/30 dark:text-night/30 uppercase tracking-widest leading-relaxed">
                                    Secure Checkout with SSL Encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
