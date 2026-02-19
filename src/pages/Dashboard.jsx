import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    ShoppingBag, Clock, CheckCircle, Truck, Edit2, Trash2, Bell,
    HelpCircle, MessageSquare, MapPin, CreditCard, Shield, Mail, Phone, RotateCcw, Package, Heart, ChevronRight, Plus, Search, LogOut
} from 'lucide-react';

const Dashboard = ({ onAddToCart }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Notifications based on orders
    const [notifications, setNotifications] = useState([]);

    // Wishlist and addresses (empty for now - can be implemented later)
    const wishlist = [];
    const addresses = [];

    // Fetch orders from Supabase
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setOrders(data || []);

                // Generate notifications from orders
                const notifs = (data || []).slice(0, 5).map((order, idx) => ({
                    id: idx + 1,
                    type: order.status === 'delivered' ? 'delivered' : order.status === 'shipped' ? 'delivery' : 'update',
                    message: order.status === 'delivered'
                        ? `Order #${order.id.slice(0, 8)} has been delivered`
                        : order.status === 'shipped'
                            ? `Your order #${order.id.slice(0, 8)} is out for delivery`
                            : `Order #${order.id.slice(0, 8)} is being ${order.status}`,
                    time: new Date(order.created_at).toLocaleDateString(),
                    unread: order.status !== 'delivered'
                }));
                setNotifications(notifs);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={18} className="text-green-600" />;
            case 'shipped': return <Truck size={18} className="text-blue-600" />;
            case 'processing': return <Clock size={18} className="text-orange-600" />;
            case 'pending': return <Package size={18} className="text-yellow-600" />;
            default: return <Package size={18} className="text-dark/40" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-orange-100 text-orange-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length;

    // User data from auth
    const userData = {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || 'Not provided',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email || 'User')}&background=D4A574&color=fff&size=200`,
        memberSince: new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recently',
    };

    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    return (
        <div className="pt-24 pb-10 px-4 md:px-6 bg-background lg:h-screen lg:overflow-hidden flex flex-col transition-colors duration-500">
            <div className="max-w-7xl mx-auto w-full lg:h-full flex flex-col overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 lg:h-full min-h-0">
                    {/* Sidebar Container */}
                    <div className="lg:col-span-1 lg:h-full min-h-0">
                        <DashboardSidebar userData={userData} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3 lg:h-full lg:overflow-y-auto pr-0 lg:pr-4 custom-scrollbar pb-10 lg:pb-0"
                    >
                        {/* Dashboard Home */}
                        {activeTab === 'home' && (
                            <div className="space-y-6">
                                {/* Welcome Section */}
                                <div className="bg-gradient-to-r from-accent to-dark text-white rounded-3xl p-8">
                                    <h1 className="text-3xl font-serif font-bold mb-2">Welcome back, {userData.name}! 👋</h1>
                                    <p className="text-white/80">Here's what's happening with your orders today</p>
                                </div>

                                {/* Order Summary Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-card rounded-2xl p-6 border border-soft/10">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-3">
                                            <ShoppingBag size={20} className="text-accent" />
                                        </div>
                                        <p className="text-2xl font-serif font-bold text-dark mb-1">{totalOrders}</p>
                                        <p className="text-xs text-dark/60 uppercase tracking-wider">Total Orders</p>
                                    </div>
                                    <div className="bg-card rounded-2xl p-6 border border-soft/10">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                            <Clock size={20} className="text-blue-600" />
                                        </div>
                                        <p className="text-2xl font-serif font-bold text-dark mb-1">{activeOrders}</p>
                                        <p className="text-xs text-dark/60 uppercase tracking-wider">Active Orders</p>
                                    </div>
                                    <div className="bg-card rounded-2xl p-6 border border-soft/10">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                            <CheckCircle size={20} className="text-green-600" />
                                        </div>
                                        <p className="text-2xl font-serif font-bold text-dark mb-1">{deliveredOrders}</p>
                                        <p className="text-xs text-dark/60 uppercase tracking-wider">Delivered</p>
                                    </div>
                                    <div className="bg-card rounded-2xl p-6 border border-soft/10">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                                            <RotateCcw size={20} className="text-red-600" />
                                        </div>
                                        <p className="text-2xl font-serif font-bold text-dark mb-1">{cancelledOrders}</p>
                                        <p className="text-xs text-dark/60 uppercase tracking-wider">Cancelled</p>
                                    </div>
                                </div>

                                {/* Current Active Orders */}
                                <div className="bg-card rounded-3xl p-6 border border-soft/10">
                                    <h2 className="text-xl font-serif font-bold text-dark mb-4">Current Active Orders</h2>
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        </div>
                                    ) : orders.filter(o => o.status !== 'delivered').length === 0 ? (
                                        <p className="text-dark/60 text-center py-8">No active orders</p>
                                    ) : (
                                        orders.filter(o => o.status !== 'delivered').map((order) => (
                                            <div key={order.id} className="border border-soft rounded-2xl p-6 mb-4 last:mb-0">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold text-dark mb-1">Order #{order.id.slice(0, 8)}</p>
                                                        <p className="text-sm text-dark/60">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs text-dark/60 mb-2">
                                                        <span>Order Placed</span>
                                                        <span>Delivery: {new Date(order.delivery_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="w-full bg-soft rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${order.status === 'processing' ? 'w-1/3 bg-orange-500' : order.status === 'shipped' ? 'w-2/3 bg-blue-500' : 'w-1/4 bg-yellow-500'}`}></div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    {order.items?.slice(0, 3).map((product, idx) => (
                                                        <div key={idx} className="w-16 h-16 bg-soft rounded-xl overflow-hidden">
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button onClick={() => setActiveTab('orders')} className="bg-card rounded-2xl p-6 text-left hover:shadow-lg transition-all group border border-soft/10">
                                        <Truck size={24} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-dark mb-1">Track Order</p>
                                        <p className="text-xs text-dark/60">Check your order status</p>
                                    </button>
                                    <button onClick={() => setActiveTab('orders')} className="bg-card rounded-2xl p-6 text-left hover:shadow-lg transition-all group border border-soft/10">
                                        <Package size={24} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-dark mb-1">View All Orders</p>
                                        <p className="text-xs text-dark/60">See complete history</p>
                                    </button>
                                    <button onClick={() => setActiveTab('support')} className="bg-card rounded-2xl p-6 text-left hover:shadow-lg transition-all group border border-soft/10">
                                        <MessageSquare size={24} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-dark mb-1">Contact Support</p>
                                        <p className="text-xs text-dark/60">We're here to help</p>
                                    </button>
                                </div>

                                {/* Recent Activity & Notifications */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-3xl p-6 border border-soft/10">
                                        <h3 className="text-lg font-bold text-dark mb-4">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {orders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="flex items-center gap-3 p-3 bg-soft rounded-xl">
                                                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                                                        {getStatusIcon(order.status)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-dark">Order #{order.id.slice(0, 8)}</p>
                                                        <p className="text-xs text-dark/60">{getStatusLabel(order.status)}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-dark/40" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-3xl p-6 border border-soft/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-dark">Notifications</h3>
                                            <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {notifications.filter(n => n.unread).length}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {notifications.slice(0, 3).map((notif) => (
                                                <div key={notif.id} className={`p-3 rounded-xl ${notif.unread ? 'bg-accent/10' : 'bg-soft'}`}>
                                                    <p className="text-sm text-dark mb-1">{notif.message}</p>
                                                    <p className="text-xs text-dark/60">{notif.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Wishlist Snapshot & Account Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-3xl p-6 border border-soft/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-dark">Wishlist</h3>
                                            <button onClick={() => setActiveTab('wishlist')} className="text-accent text-sm font-bold hover:text-dark">
                                                View All
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                                <Heart size={28} className="text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-serif font-bold text-dark">{wishlist.length}</p>
                                                <p className="text-sm text-dark/60">Saved Items</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-3xl p-6 border border-soft/10">
                                        <h3 className="text-lg font-bold text-dark mb-4">Account Quick Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-accent mt-1" />
                                                <div>
                                                    <p className="text-xs text-dark/60 mb-1">Default Address</p>
                                                    <p className="text-sm text-dark font-bold">{userData.defaultAddress}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CreditCard size={16} className="text-accent mt-1" />
                                                <div>
                                                    <p className="text-xs text-dark/60 mb-1">Default Payment</p>
                                                    <p className="text-sm text-dark font-bold">{userData.defaultPayment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab - Detailed View */}
                        {activeTab === 'orders' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-2xl font-serif font-bold text-dark mb-6">My Orders</h2>
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-dark/60">Loading orders...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-12">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <button onClick={() => window.location.reload()} className="text-accent hover:text-dark">
                                            Try Again
                                        </button>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package size={64} className="mx-auto mb-4 text-dark/20" />
                                        <h3 className="text-xl font-bold text-dark mb-2">No Orders Yet</h3>
                                        <p className="text-dark/60 mb-6">Start shopping to see your orders here</p>
                                        <a href="/products" className="inline-block bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-dark transition-all">
                                            Browse Products
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-soft rounded-2xl p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold text-dark mb-1">Order #{order.id.slice(0, 8)}</p>
                                                        <p className="text-sm text-dark/60">Placed on {new Date(order.created_at).toLocaleDateString()} | {order.items?.length || 0} items</p>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-dark/40 mb-2">Total Amount</p>
                                                        <p className="text-lg font-bold text-dark">${order.total?.toFixed(2) || '0.00'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-dark/40 mb-2">Delivery Date</p>
                                                        <p className="text-lg font-bold text-dark">{new Date(order.delivery_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-4">
                                                    {order.items?.map((product, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 bg-background rounded-xl p-3 border border-soft/10">
                                                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-dark">{product.name}</p>
                                                                <p className="text-sm text-dark/60">{product.quantity} x ${product.price?.toFixed(2) || '0.00'}</p>
                                                            </div>
                                                            <p className="font-bold text-dark">${((product.quantity || 0) * (product.price || 0)).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t border-soft flex justify-end gap-3">
                                                    {order.status === 'shipped' && (
                                                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all">
                                                            Track Order
                                                        </button>
                                                    )}
                                                    {order.status === 'delivered' && (
                                                        <button className="bg-soft px-4 py-2 rounded-2xl font-bold text-sm hover:bg-dark hover:text-white dark:hover:text-night transition-all">
                                                            Leave Review
                                                        </button>
                                                    )}
                                                    {order.status !== 'delivered' && (
                                                        <button className="bg-red-50 text-red-500 px-4 py-2 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    <button className="bg-accent text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-dark hover:text-white dark:hover:text-night transition-all">
                                                        Order Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Track Order Tab */}
                        {activeTab === 'track' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-2xl font-serif font-bold text-dark mb-6">Track Your Order</h2>
                                <div className="max-w-2xl">
                                    <p className="text-dark/60 mb-8">Enter your order number and email address to track your shipment status in real-time.</p>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">Order Number</label>
                                                <input type="text" placeholder="e.g. ORD-2024-001" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">Email Address</label>
                                                <input type="email" placeholder="ivan@example.com" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold" />
                                            </div>
                                        </div>
                                        <button className="bg-accent text-white px-8 py-4 rounded-2xl font-bold hover:bg-dark transition-all w-full md:w-auto">
                                            Track Status
                                        </button>
                                    </div>

                                    {/* Active Tracking Status (Mockup) */}
                                    <div className="mt-12 p-8 border border-soft rounded-3xl">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-dark/40 mb-1">Status</p>
                                                <p className="text-lg font-bold text-blue-600">In Transit</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs uppercase tracking-widest text-dark/40 mb-1">Expected Delivery</p>
                                                <p className="text-lg font-bold text-dark">Feb 02, 2024</p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            {/* Tracking Line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-soft"></div>
                                            <div className="absolute left-4 top-0 h-1/2 w-0.5 bg-accent"></div>

                                            <div className="space-y-8 relative">
                                                <div className="flex gap-6 items-start">
                                                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white z-10">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark">Order Confirmed</p>
                                                        <p className="text-sm text-dark/60">Jan 28, 2024 - 10:30 AM</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 items-start">
                                                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white z-10">
                                                        <Package size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark">Shipped from Warehouse</p>
                                                        <p className="text-sm text-dark/60">Jan 29, 2024 - 02:15 PM</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 items-start">
                                                    <div className="w-8 h-8 bg-soft rounded-full flex items-center justify-center text-dark/40 z-10 border-4 border-white">
                                                        <Truck size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark/40">Out for Delivery</p>
                                                        <p className="text-sm text-dark/40">Estimated: Feb 01, 2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Returns & Refunds Tab */}
                        {activeTab === 'returns' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-2xl font-serif font-bold text-dark mb-6">Returns & Refunds</h2>
                                <div className="space-y-8">
                                    <div className="bg-soft/50 p-6 rounded-2xl border border-dashed border-dark/10">
                                        <h3 className="font-bold text-dark mb-2">Our Return Policy</h3>
                                        <p className="text-sm text-dark/60 leading-relaxed">
                                            We want you to love your furniture. If you're not completely satisfied, you can return most items within 30 days of delivery.
                                            Items must be in original condition and packaging.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-dark mb-4">Start a Return</h3>
                                        <p className="text-sm text-dark/60 mb-6">Select the order you want to return items from:</p>

                                        <div className="space-y-4">
                                            {orders.filter(o => o.status === 'delivered').map(order => (
                                                <div key={order.id} className="border border-soft rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-accent transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-soft rounded-xl flex items-center justify-center font-bold text-dark">
                                                            <RotateCcw size={20} className="text-accent" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-dark">Order #{order.id.slice(0, 8)}</p>
                                                            <p className="text-xs text-dark/60">Delivered on {new Date(order.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <button className="bg-dark text-white dark:text-night px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-all">
                                                        Begin Return
                                                    </button>
                                                </div>
                                            ))}
                                            {orders.filter(o => o.status === 'delivered').length === 0 && (
                                                <div className="text-center py-12 bg-soft/20 rounded-3xl">
                                                    <RotateCcw size={48} className="mx-auto text-dark/10 mb-4" />
                                                    <p className="text-dark/40 font-bold">No eligible orders for return</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-soft">
                                        <h3 className="text-lg font-bold text-dark mb-4">Past Returns</h3>
                                        <div className="text-center py-8 text-dark/40 italic text-sm">
                                            You haven't initiated any returns yet.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Wishlist Tab - Redesigned to match Product Cards */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-serif font-bold text-dark italic">My Wishlist</h2>
                                    <p className="text-dark/40 font-bold uppercase tracking-widest text-xs">{wishlist.length} Items Saved</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {wishlist.map((item) => (
                                        <motion.div key={item.id} layout className="group relative">
                                            <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-soft relative mb-6">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to remove ${item.name} from your wishlist?`)) {
                                                            setWishlist(prev => prev.filter(i => i.id !== item.id));
                                                        }
                                                    }}
                                                    className="absolute top-6 right-6 p-3 glass rounded-full text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                >
                                                    <Heart size={20} fill="currentColor" />
                                                </button>

                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 w-[calc(100%-48px)]">
                                                    <button
                                                        onClick={() => onAddToCart(item)}
                                                        className="w-full bg-dark text-white dark:text-night py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-colors"
                                                    >
                                                        <Plus size={20} /> Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-start px-2">
                                                <div>
                                                    <p className="text-dark/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Furniture</p>
                                                    <h3 className="text-lg font-bold text-dark group-hover:text-accent transition-colors">{item.name}</h3>
                                                </div>
                                                <div className="text-lg font-serif font-bold text-dark">${item.price.toFixed(2)}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Account Tab - Detailed View */}
                        {activeTab === 'profile' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-3xl font-serif font-bold text-dark italic mb-8">Personal Profile</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="md:col-span-1 text-center">
                                        <div className="relative inline-block group">
                                            <img src={userData.avatar} alt={userData.name} className="w-40 h-40 rounded-full border-8 border-soft/50 shadow-xl mx-auto" />
                                            <button className="absolute bottom-2 right-2 bg-dark text-white dark:text-night p-3 rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-bold text-dark mt-6">{userData.name}</h3>
                                        <p className="text-dark/40 font-bold text-xs uppercase tracking-widest mt-1">Premium Member</p>

                                        <div className="mt-8 space-y-4">
                                            <div className="bg-background p-4 rounded-2xl text-left border border-soft/10">
                                                <p className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mb-1">Joined</p>
                                                <p className="font-bold text-dark">{userData.memberSince}</p>
                                            </div>
                                            <div className="bg-background p-4 rounded-2xl text-left border border-soft/10">
                                                <p className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mb-1">Total Spent</p>
                                                <p className="font-bold text-dark text-xl">$12,450.00</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Full Name</label>
                                                <input type="text" defaultValue={userData.name} className="w-full bg-background border border-soft/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-dark" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Email Address</label>
                                                <input type="email" defaultValue={userData.email} className="w-full bg-background border border-soft/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-dark" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Phone Number</label>
                                                <input type="text" defaultValue={userData.phone} className="w-full bg-background border border-soft/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-dark" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest px-1">Birthday</label>
                                                <input type="text" placeholder="MM / DD / YYYY" className="w-full bg-background border border-soft/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-dark" />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-soft/50 flex justify-end gap-4">
                                            <button className="px-8 py-4 rounded-2xl font-bold bg-background text-dark hover:bg-dark hover:text-white dark:hover:text-night transition-all border border-soft/10">Cancel</button>
                                            <button className="px-8 py-4 rounded-2xl font-bold bg-accent text-white hover:bg-dark hover:text-white dark:hover:text-night transition-all shadow-lg shadow-accent/20">Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-serif font-bold text-dark">Saved Addresses</h2>
                                    <button className="bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-dark transition-all shadow-lg shadow-accent/20">
                                        Add New Address
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="border border-soft/20 rounded-2xl p-6 relative bg-background/50">
                                            {address.isDefault && (
                                                <span className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                                                    Default
                                                </span>
                                            )}
                                            <div className="mb-4">
                                                <p className="text-xs uppercase tracking-wider text-dark/40 mb-2">{address.type}</p>
                                                <p className="font-bold text-dark mb-1">{address.name}</p>
                                                <p className="text-sm text-dark/60">{address.address}</p>
                                                <p className="text-sm text-dark/60">{address.city}, {address.state} {address.zip}</p>
                                            </div>
                                            <div className="flex gap-3 pt-4 border-t border-soft/20">
                                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-background rounded-2xl font-bold text-sm hover:bg-dark hover:text-white dark:hover:text-night transition-all border border-soft/10">
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Methods Tab - Redesigned as Huge Cards */}
                        {activeTab === 'payment' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-3xl font-serif font-bold text-dark italic">Payment Methods</h2>
                                    <button className="bg-dark text-white dark:text-night px-8 py-4 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                                        <Plus size={20} /> Add New
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group relative bg-gradient-to-br from-dark to-accent/80 p-10 rounded-[40px] text-white shadow-2xl overflow-hidden min-h-[240px] flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <CreditCard size={180} />
                                        </div>
                                        <div className="flex justify-between items-start z-10">
                                            <div className="w-16 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center font-bold italic">VISA</div>
                                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">Default</div>
                                        </div>
                                        <div className="z-10">
                                            <p className="text-xl font-bold tracking-[0.2em] mb-4">•••• •••• •••• 4242</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Card Holder</p>
                                                    <p className="font-bold">{userData.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Expires</p>
                                                    <p className="font-bold">12/25</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-white/10 backdrop-blur-lg border-t border-white/10 flex gap-4">
                                            <button className="flex-1 py-3 bg-white text-dark rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-colors">Edit</button>
                                            <button className="flex-1 py-3 bg-red-500/80 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Remove</button>
                                        </div>
                                    </div>

                                    <div className="group relative bg-card p-10 rounded-[40px] text-dark shadow-xl overflow-hidden min-h-[240px] flex flex-col justify-between border-2 border-transparent hover:border-soft transition-all">
                                        <div className="absolute top-0 right-0 p-12 opacity-5">
                                            <CreditCard size={180} />
                                        </div>
                                        <div className="flex justify-between items-start z-10">
                                            <div className="w-16 h-10 bg-dark/5 rounded-lg flex items-center justify-center font-bold italic">MC</div>
                                        </div>
                                        <div className="z-10">
                                            <p className="text-xl font-bold tracking-[0.2em] mb-4">•••• •••• •••• 8888</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-dark/40 uppercase tracking-widest mb-1">Card Holder</p>
                                                    <p className="font-bold">{userData.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-dark/40 uppercase tracking-widest mb-1">Expires</p>
                                                    <p className="font-bold">06/26</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-black/5 backdrop-blur-lg flex gap-4">
                                            <button className="flex-1 py-3 bg-card text-dark rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-colors border border-soft shadow-sm">Edit</button>
                                            <button className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-colors">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab - Redesigned & Aligned */}
                        {activeTab === 'notifications' && (
                            <div className="bg-card rounded-3xl p-10 border border-soft/10">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-3xl font-serif font-bold text-dark italic">Notifications</h2>
                                    <button className="text-accent font-bold text-sm hover:text-dark px-4 py-2 bg-accent/5 rounded-xl transition-all">
                                        Mark All as Read
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`p-6 rounded-[32px] border-2 transition-all group ${notif.unread ? 'border-accent/20 bg-accent/5 shadow-lg shadow-accent/5' : 'border-soft bg-card hover:border-dark/10'}`}>
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 ${notif.type === 'delivery' ? 'bg-blue-100 text-blue-600' : notif.type === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {notif.type === 'delivery' && <Truck size={24} />}
                                                    {notif.type === 'delivered' && <CheckCircle size={24} />}
                                                    {notif.type === 'update' && <Clock size={24} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-lg font-bold text-dark truncate pr-4">{notif.message}</p>
                                                        {notif.unread && (
                                                            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shrink-0 mt-2"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xs font-bold text-dark/40 uppercase tracking-widest">{notif.time}</p>
                                                        <span className="w-1 h-1 bg-soft rounded-full"></span>
                                                        <button className="text-xs font-bold text-accent hover:text-dark transition-colors">Order Details</button>
                                                    </div>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 p-3 bg-soft rounded-full text-dark/40 hover:text-red-500 hover:bg-red-50 transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Help Center Tab - Redesigned */}
                        {activeTab === 'support' && (
                            <div className="bg-card rounded-3xl p-10 border border-soft/10">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-serif font-bold text-dark italic mb-4">How can we help?</h2>
                                    <div className="max-w-xl mx-auto relative mt-8">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                                        <input type="text" placeholder="Search for questions, orders, or topics..." className="w-full bg-background border border-soft/10 px-16 py-5 rounded-[24px] focus:ring-2 focus:ring-accent outline-none font-bold text-dark" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    {[
                                        { title: 'Order Status', icon: Package, desc: 'Track and manage orders' },
                                        { title: 'Shipping', icon: Truck, desc: 'Delivery times and costs' },
                                        { title: 'Returns', icon: RotateCcw, desc: 'Return policy & refunds' },
                                        { title: 'Billing', icon: CreditCard, desc: 'Payments & invoices' }
                                    ].map((cat, i) => (
                                        <button key={i} className="p-8 bg-background rounded-[32px] hover:bg-dark hover:text-white dark:hover:text-night transition-all text-left group border border-soft/10">
                                            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-accent group-hover:text-white dark:group-hover:text-night transition-colors">
                                                <cat.icon size={24} />
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">{cat.title}</h4>
                                            <p className="text-xs opacity-60 font-medium">{cat.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-background rounded-[40px] p-10 flex flex-col md:flex-row gap-10 items-center border border-soft/10">
                                    <div className="shrink-0">
                                        <div className="flex -space-x-4 mb-4 justify-center md:justify-start">
                                            {[1, 2, 3].map(i => (
                                                <img key={i} className="w-12 h-12 rounded-full border-4 border-[#F5F5F7] shadow-lg" src={`https://i.pravatar.cc/150?u=${i}`} alt="support avatar" />
                                            ))}
                                            <div className="w-12 h-12 rounded-full border-4 border-[#F5F5F7] bg-accent flex items-center justify-center text-white text-xs font-bold shadow-lg">+</div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-dark">Talk to an expert</h3>
                                        <p className="text-dark/60 mt-2">Available 24/7 for you</p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                        <button className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                                <MessageSquare size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-dark">Live Chat</p>
                                                <p className="text-[10px] text-dark/40 uppercase tracking-widest">Usually instant</p>
                                            </div>
                                        </button>
                                        <button className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                                <Mail size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-dark">Email Support</p>
                                                <p className="text-[10px] text-dark/40 uppercase tracking-widest">Within 2 hours</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Support Tab */}
                        {activeTab === 'contact' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-2xl font-serif font-bold text-dark mb-6">Contact Support</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center p-6 bg-soft rounded-2xl">
                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageSquare size={20} className="text-white" />
                                        </div>
                                        <p className="font-bold text-dark mb-1">Live Chat</p>
                                        <p className="text-xs text-dark/60 mb-3">Available 24/7</p>
                                        <button className="text-accent font-bold text-sm hover:text-dark">Start Chat</button>
                                    </div>
                                    <div className="text-center p-6 bg-soft rounded-2xl">
                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Mail size={20} className="text-white" />
                                        </div>
                                        <p className="font-bold text-dark mb-1">Email</p>
                                        <p className="text-xs text-dark/60 mb-3">support@furnit.com</p>
                                        <button className="text-accent font-bold text-sm hover:text-dark">Send Email</button>
                                    </div>
                                    <div className="text-center p-6 bg-soft rounded-2xl">
                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Phone size={20} className="text-white" />
                                        </div>
                                        <p className="font-bold text-dark mb-1">Phone</p>
                                        <p className="text-xs text-dark/60 mb-3">+1 (555) 123-4567</p>
                                        <button className="text-accent font-bold text-sm hover:text-dark">Call Now</button>
                                    </div>
                                </div>
                                <div className="border border-soft rounded-2xl p-6">
                                    <h3 className="font-bold text-dark mb-4">Send us a message</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-2">Subject</label>
                                            <input type="text" placeholder="How can we help?" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-2">Message</label>
                                            <textarea rows="4" placeholder="Describe your issue..." className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none resize-none"></textarea>
                                        </div>
                                        <button className="w-full bg-accent text-white py-4 rounded-2xl font-bold hover:bg-dark hover:text-white dark:hover:text-night transition-all">
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-card rounded-3xl p-8 border border-soft/10">
                                <h2 className="text-2xl font-serif font-bold text-dark mb-6">Settings</h2>
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-soft">
                                        <h3 className="text-lg font-bold text-dark mb-4">Preferences</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-dark">Email Notifications</p>
                                                    <p className="text-sm text-dark/60">Receive order updates via email</p>
                                                </div>
                                                <button className="w-12 h-6 bg-accent rounded-full relative">
                                                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-dark">SMS Notifications</p>
                                                    <p className="text-sm text-dark/60">Receive delivery alerts via SMS</p>
                                                </div>
                                                <button className="w-12 h-6 bg-soft rounded-full relative">
                                                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-dark">Marketing Emails</p>
                                                    <p className="text-sm text-dark/60">Receive promotional offers</p>
                                                </div>
                                                <button className="w-12 h-6 bg-accent rounded-full relative">
                                                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-6 border-b border-soft">
                                        <h3 className="text-lg font-bold text-dark mb-4">Security</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">Current Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">Confirm New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-soft border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none" />
                                            </div>
                                            <button className="bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-dark hover:text-white dark:hover:text-night transition-all">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-dark mb-4">Danger Zone</h3>
                                        <button className="bg-red-50 text-red-500 px-8 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;