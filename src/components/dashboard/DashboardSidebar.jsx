import React from 'react';
import { motion } from 'framer-motion';
import {
    User, Package, Heart, MapPin, CreditCard, Settings, LogOut,
    Home, Truck, RotateCcw, Bell, HelpCircle, MessageSquare
} from 'lucide-react';

const DashboardSidebar = ({ userData, activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'home', label: 'Dashboard Home', icon: Home, section: 'dashboard' },
        { id: 'orders', label: 'My Orders', icon: Package, section: 'orders' },
        { id: 'track', label: 'Track Order', icon: Truck, section: 'orders' },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, section: 'orders' },
        { id: 'wishlist', label: 'Wishlist', icon: Heart, section: 'saved' },
        { id: 'profile', label: 'Profile', icon: User, section: 'account' },
        { id: 'addresses', label: 'Addresses', icon: MapPin, section: 'account' },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard, section: 'account' },
        { id: 'notifications', label: 'Notifications', icon: Bell, section: 'notifications' },
        { id: 'support', label: 'Help Center', icon: HelpCircle, section: 'support' },
        { id: 'settings', label: 'Settings', icon: Settings, section: 'settings' }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>
            <div className="bg-card rounded-[32px] p-6 h-full flex flex-col shadow-xl shadow-dark/5 border border-soft/10 relative overflow-hidden transition-colors duration-500">
                {/* User Info - Premium & Clear */}
                <div className="text-center mb-6 pb-6 border-b border-soft/50 shrink-0">
                    <div className="relative inline-block mb-3">
                        <img src={userData.avatar} alt={userData.name} className="w-16 h-16 rounded-full mx-auto border-4 border-soft/50 object-cover shadow-sm" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-0.5">{userData.name}</h3>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none">Premium Member</p>
                </div>

                {/* Menu - Clean & Spaced */}
                <nav className="flex-grow overflow-y-auto no-scrollbar space-y-1 py-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                whileHover={{ x: 6 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[13px] transition-all relative group ${isActive
                                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                    : 'text-dark/70 hover:text-dark hover:bg-soft/50'
                                    }`}
                            >
                                <Icon size={18} className={`${isActive ? 'text-white' : 'text-dark/40 group-hover:text-accent'} transition-colors`} />
                                {item.label}
                                {item.id === 'notifications' && (
                                    <span className="ml-auto w-2 h-2 bg-red-400 rounded-full"></span>
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Logout Button - Anchored at the bottom */}
                <div className="pt-6 mt-2 border-t border-soft/50 shrink-0">
                    <motion.button
                        whileHover={{ x: 6, color: '#ef4444' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/login'}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[13px] text-dark/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-serif italic"
                    >
                        <LogOut size={18} />
                        Logout
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardSidebar;
