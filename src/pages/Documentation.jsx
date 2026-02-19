import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import {
    Search, HelpCircle, Truck, RotateCcw, CreditCard,
    User, ShieldCheck, MessageSquare, ExternalLink,
    ChevronRight, BookOpen, Clock, Mail, Phone,
    Package, MapPin, CheckCircle, Info
} from 'lucide-react';

const Documentation = () => {
    const { hash } = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('getting-started');

    const docContent = [
        { id: 'getting-started', title: 'Welcome to Furnit', content: 'Discover a contemporary approach to living spaces. We combine aesthetic excellence with functional precision to bring you the finest furniture.', category: 'Getting Started' },
        { id: 'getting-started', title: 'Common Questions', content: 'How do I place an order? Do I need an account to shop? Can I cancel my order?', category: 'Getting Started' },
        { id: 'ordertracking', title: 'Monitor your shipment', content: 'Once your order is shipped, you will receive an email confirmation with your unique tracking number. You can track your order directly through our dashboard or via the carrier\'s website.', category: 'Order Tracking' },
        { id: 'shipping', title: 'Shipping Costs', content: 'Standard delivery is free for all orders over $1,000. For orders under $1,000, a flat shipping fee of $49 applies. Express Shipping available for $99.', category: 'Shipping & Delivery' },
        { id: 'shipping', title: 'Domestic & International', content: 'We currently ship across the entire continental United States. International shipping is available for certain collections to Europe and Canada.', category: 'Shipping & Delivery' },
        { id: 'returns', title: 'Returns Policy', content: '30-Day Evaluation Period. If you\'re not completely satisfied, you can initiate a return within 30 days of receiving your item.', category: 'Returns & Refunds' },
        { id: 'payments', title: 'Secure Checkout', content: 'All transactions are protected by industry-leading encryption. Level 1 PCI Compliance. We accept Visa, Mastercard, AMEX, Apple Pay, Google Pay, PayPal.', category: 'Payments & Security' },
        { id: 'warranty', title: 'Warranty & Care', content: 'We offer extensive warranties on all our furniture. Learn how to care for your materials and maintain their beauty for years to come.', category: 'Warranty & Care' },
    ];

    const filteredResults = docContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(id);
            }
        }
    }, [hash]);

    // Scroll Spy for active section
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Detect when section is in the top-ish part of the screen
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
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const categories = [
        { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
        { id: 'ordertracking', label: 'Order Tracking', icon: Package },
        { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
        { id: 'payments', label: 'Payments & Security', icon: CreditCard },
        { id: 'account', label: 'Account Management', icon: User },
        { id: 'warranty', label: 'Warranty & Care', icon: ShieldCheck },
    ];

    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <Icon size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-dark">{title}</h2>
        </div>
    );

    const InfoCard = ({ title, children, icon: Icon }) => (
        <div className="bg-card rounded-3xl p-8 border border-soft/10 hover:shadow-xl hover:shadow-dark/5 transition-all duration-500 mb-6 group">
            <div className="flex items-start gap-4">
                {Icon && <div className="mt-1 text-accent group-hover:scale-110 transition-transform"><Icon size={20} /></div>}
                <div>
                    <h4 className="text-lg font-bold text-dark mb-3 leading-tight">{title}</h4>
                    <div className="text-dark/60 text-sm leading-relaxed space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        Help Center & Documentation
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-serif font-bold text-dark mb-8 tracking-tighter"
                    >
                        How can we <span className="italic text-accent underline decoration-dark/10">help</span> you?
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-accent transition-colors" size={24} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions, tracking, policies..."
                            className="w-full bg-background border-2 border-soft px-16 py-6 rounded-[32px] shadow-xl shadow-dark/5 focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none text-lg font-medium transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark font-bold text-xs bg-soft px-3 py-1.5 rounded-xl transition-all"
                            >
                                ESC TO CLEAR
                            </button>
                        )}
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 bg-soft rounded-xl text-[10px] font-bold text-dark/40 uppercase tracking-widest ${searchQuery ? 'opacity-0 select-none' : ''}`}>
                            Press Enter ↵
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <div className="lg:sticky lg:top-32 space-y-2 bg-background/50 backdrop-blur-xl p-4 rounded-[40px] border border-white/50 dark:border-white/10 shadow-xl shadow-dark/5">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = !searchQuery && activeSection === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveSection(cat.id);
                                            setTimeout(() => {
                                                document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[13px] transition-all ${isActive
                                            ? 'bg-dark text-white dark:text-night shadow-xl shadow-dark/20'
                                            : 'text-dark/50 hover:bg-card hover:text-dark hover:shadow-lg hover:shadow-dark/5'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-white dark:text-accent' : ''} />
                                        {cat.label}
                                        {isActive && <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 bg-accent rounded-full" />}
                                    </button>
                                );
                            })}
                            <div className="pt-4 mt-4 border-t border-dark/5">
                                <Link to="/dashboard" className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[13px] text-accent hover:bg-accent/10 transition-all">
                                    <ExternalLink size={18} />
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content Sections */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {searchQuery ? (
                                <motion.div
                                    key="search-results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-soft">
                                        <h2 className="text-2xl font-serif font-bold text-dark">
                                            Search Results for <span className="text-accent">"{searchQuery}"</span>
                                        </h2>
                                        <p className="text-sm text-dark/40 font-bold">{filteredResults.length} found</p>
                                    </div>

                                    {filteredResults.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {filteredResults.map((result, idx) => (
                                                <motion.div
                                                    key={`${result.id}-${idx}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="bg-card p-8 rounded-[32px] border border-soft hover:border-accent transition-all duration-300 group cursor-pointer"
                                                    onClick={() => {
                                                        const id = result.id;
                                                        setSearchQuery('');
                                                        setActiveSection(id);
                                                        setTimeout(() => {
                                                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                                        }, 100);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full">
                                                            {result.category}
                                                        </span>
                                                        <ChevronRight size={16} className="text-dark/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-accent transition-colors">{result.title}</h3>
                                                    <p className="text-dark/60 text-sm leading-relaxed">{result.content}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-card rounded-[48px] border-2 border-dashed border-soft">
                                            <div className="w-20 h-20 bg-soft rounded-full flex items-center justify-center mx-auto mb-6 text-dark/20">
                                                <Search size={40} />
                                            </div>
                                            <h3 className="text-xl font-bold text-dark mb-2">No results found</h3>
                                            <p className="text-dark/40 max-w-xs mx-auto">
                                                Try adjusting your search terms or browse our categories.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="main-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-24"
                                >
                                    {/* Getting Started Section */}
                                    <section id="getting-started" className="scroll-mt-32">
                                        <SectionHeader title="Getting Started" icon={BookOpen} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoCard title="Welcome to Furnit">
                                                <p>Discover a contemporary approach to living spaces. We combine aesthetic excellence with functional precision to bring you the finest furniture.</p>
                                                <Link to="/products" className="inline-flex items-center gap-2 text-accent font-bold hover:underline">
                                                    Browse Collections <ChevronRight size={16} />
                                                </Link>
                                            </InfoCard>
                                            <InfoCard title="Common Questions">
                                                <ul className="space-y-3">
                                                    <li>• How do I place an order?</li>
                                                    <li>• Do I need an account to shop?</li>
                                                    <li>• Can I cancel my order?</li>
                                                </ul>
                                            </InfoCard>
                                        </div>
                                    </section>

                                    {/* Order Tracking Section */}
                                    <section id="ordertracking" className="scroll-mt-32">
                                        <SectionHeader title="Order Tracking" icon={Package} />
                                        <div className="bg-card rounded-[40px] p-10 border border-soft shadow-xl shadow-dark/5 overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-12 text-accent/5 group-hover:scale-110 transition-transform duration-700">
                                                <Package size={200} />
                                            </div>
                                            <div className="relative z-10 max-w-xl">
                                                <h3 className="text-2xl font-serif font-bold text-dark mb-4 italic">Monitor your shipment in real-time</h3>
                                                <p className="text-dark/60 mb-8 leading-relaxed">
                                                    Once your order is shipped, you will receive an email confirmation with your unique tracking number.
                                                    You can track your order directly through our dashboard or via the carrier's website.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <Link to="/dashboard" className="px-8 py-4 bg-accent text-white dark:text-night rounded-2xl font-bold hover:bg-dark hover:text-white dark:hover:text-night transition-all text-center">
                                                        Track in Dashboard
                                                    </Link>
                                                    <button className="px-8 py-4 border-2 border-soft text-dark rounded-2xl font-bold hover:border-dark transition-all">
                                                        Carrier Websites
                                                    </button>
                                                </div>
                                                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    {[
                                                        { label: 'Carrier', value: 'UPS / FedEx' },
                                                        { label: 'Updates', value: 'Real-time' },
                                                        { label: 'Notifications', value: 'SMS & Email' }
                                                    ].map((stat, i) => (
                                                        <div key={i}>
                                                            <p className="text-[10px] text-dark/30 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                                                            <p className="text-sm font-bold text-dark">{stat.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Shipping Section */}
                                    <section id="shipping" className="scroll-mt-32">
                                        <SectionHeader title="Shipping & Delivery" icon={Truck} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoCard title="Shipping Costs" icon={Info}>
                                                <p>Standard delivery is free for all orders over $1000. For orders under $1000, a flat shipping fee of $49 applies.</p>
                                                <div className="pt-4 border-t border-soft mt-4">
                                                    <p className="font-bold text-dark mb-2">Express Shipping</p>
                                                    <p>Available for select regions at $99. Delivery within 1-2 business days.</p>
                                                </div>
                                            </InfoCard>
                                            <InfoCard title="Domestic & International" icon={MapPin}>
                                                <p>We currently ship across the entire continental United States. International shipping is available for certain collections to Europe and Canada.</p>
                                            </InfoCard>
                                        </div>
                                        <div className="mt-8 p-8 bg-dark dark:bg-night rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl transition-colors duration-500">
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">Next Day Delivery Available</h4>
                                                <p className="text-white/60 text-sm">Order by 2 PM for next business day arrival on in-stock items.</p>
                                            </div>
                                            <button className="px-8 py-4 bg-accent text-white dark:text-night rounded-2xl font-bold hover:bg-white hover:text-dark dark:hover:bg-dark dark:hover:text-white transition-all w-full md:w-auto">
                                                Check Availability
                                            </button>
                                        </div>
                                    </section>

                                    {/* Returns Section */}
                                    <section id="returns" className="scroll-mt-32">
                                        <SectionHeader title="Returns & Refunds" icon={RotateCcw} />
                                        <div className="space-y-6">
                                            <InfoCard title="30-Day Evaluation Period">
                                                <p>We want you to love your furniture. If you're not completely satisfied, you can initiate a return within 30 days of receiving your item.</p>
                                                <div className="flex gap-2 mt-4">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Free Returns</span>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Full Refund</span>
                                                </div>
                                            </InfoCard>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {[
                                                    { title: '1. Initiate', desc: 'Go to Dashboard -> Returns' },
                                                    { title: '2. Prepare', desc: 'Securely package the item' },
                                                    { title: '3. Pickup', desc: 'We schedule a home pickup' }
                                                ].map((step, i) => (
                                                    <div key={i} className="p-6 bg-card rounded-3xl border border-soft text-center group">
                                                        <div className="w-8 h-8 bg-soft rounded-full flex items-center justify-center mx-auto mb-4 text-xs font-bold text-dark group-hover:bg-accent group-hover:text-white transition-colors">
                                                            {i + 1}
                                                        </div>
                                                        <h5 className="font-bold text-dark mb-1">{step.title}</h5>
                                                        <p className="text-xs text-dark/40">{step.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Payments Section */}
                                    <section id="payments" className="scroll-mt-32">
                                        <SectionHeader title="Payments & Security" icon={CreditCard} />
                                        <div className="bg-card rounded-[40px] p-10 border border-soft shadow-xl shadow-dark/5">
                                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-dark mb-6">Secure Checkout</h3>
                                                    <p className="text-dark/60 mb-8 leading-relaxed">
                                                        All transactions are protected by industry-leading encryption. We do not store your full credit card information on our servers.
                                                    </p>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4 p-4 bg-soft rounded-2xl">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent">
                                                                <ShieldCheck size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-dark text-sm">Level 1 PCI Compliance</p>
                                                                <p className="text-xs text-dark/40">The highest global security standard</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 p-4 bg-soft rounded-2xl">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent">
                                                                <CheckCircle size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-dark text-sm">Buyer Protection</p>
                                                                <p className="text-xs text-dark/40">24/7 fraud monitoring and support</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-80 bg-soft rounded-3xl p-8">
                                                    <p className="text-xs font-bold text-dark/30 uppercase tracking-widest mb-6">Accepted Methods</p>
                                                    <div className="grid grid-cols-2 gap-4 text-dark/60">
                                                        {['Visa', 'Mastercard', 'AMEX', 'Apple Pay', 'Google Pay', 'PayPal'].map((method) => (
                                                            <div key={method} className="bg-card p-3 rounded-xl text-center text-xs font-bold shadow-sm">
                                                                {method}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-8 pt-6 border-t border-dark/5">
                                                        <p className="text-[10px] text-dark/30 leading-relaxed">
                                                            Financing options available through Klarna and Affirm. Select at checkout.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Support Section */}
                                    <section id="contact" className="scroll-mt-32">
                                        <div className="bg-gradient-to-br from-dark to-accent/90 rounded-[48px] p-12 text-white relative overflow-hidden">
                                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                                            <div className="relative z-10 text-center max-w-2xl mx-auto">
                                                <h3 className="text-4xl font-serif font-bold mb-6 italic">Still have questions?</h3>
                                                <p className="text-white/70 mb-10 text-lg">
                                                    Our dedicated support team is here to assist you 24 hours a day, 7 days a week.
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    {[
                                                        { icon: MessageSquare, label: 'Live Chat', desc: 'Instant response' },
                                                        { icon: Mail, label: 'Email Support', desc: 'Within 2 hours' },
                                                        { icon: Phone, label: 'Call Us', desc: '+1 (800) FURNIT' }
                                                    ].map((card, i) => (
                                                        <button key={i} className="p-6 bg-white/10 backdrop-blur-md rounded-3xl hover:bg-white/20 transition-all group">
                                                            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                                <card.icon size={20} />
                                                            </div>
                                                            <p className="font-bold text-sm mb-1">{card.label}</p>
                                                            <p className="text-[10px] text-white/50 uppercase tracking-widest">{card.desc}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <footer className="text-center pb-12">
                                        <p className="text-sm text-dark/30 mb-4">Did you find this documentation helpful?</p>
                                        <div className="flex justify-center gap-4">
                                            <button className="px-6 py-2 rounded-full border border-soft hover:bg-card transition-all text-xs font-bold text-dark">Yes, thanks!</button>
                                            <button className="px-6 py-2 rounded-full border border-soft hover:bg-card transition-all text-xs font-bold text-dark">Not really</button>
                                        </div>
                                    </footer>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
