import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
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

    return (
        <footer className="bg-soft pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-8">
                        <h3 className="text-3xl font-serif font-bold text-dark tracking-tighter">furnit.</h3>
                        <p className="text-dark/50 leading-relaxed max-w-xs">
                            Crafting modern comfort for every room. Timeless designs, sustainable materials, and exceptional quality.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-dark/10 flex items-center justify-center text-dark hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-dark uppercase tracking-widest text-xs mb-8">Shop</h4>
                        <ul className="space-y-4 text-dark/60 text-sm">
                            <li><button onClick={() => scrollToSection('catalog')} className="hover:text-accent transition-colors">Living Room</button></li>
                            <li><button onClick={() => scrollToSection('catalog')} className="hover:text-accent transition-colors">Bedroom</button></li>
                            <li><button onClick={() => scrollToSection('catalog')} className="hover:text-accent transition-colors">Dining</button></li>
                            <li><button onClick={() => scrollToSection('catalog')} className="hover:text-accent transition-colors">Home Office</button></li>
                            <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-dark uppercase tracking-widest text-xs mb-8">Support</h4>
                        <ul className="space-y-4 text-dark/60 text-sm">
                            <li><button onClick={() => scrollToSection('locations')} className="hover:text-accent transition-colors">Contact Us</button></li>
                            <li><Link to="/help#shipping" className="hover:text-accent transition-colors">Shipping & Delivery</Link></li>
                            <li><Link to="/help#returns" className="hover:text-accent transition-colors">Returns & Refunds</Link></li>
                            <li><Link to="/help#getting-started" className="hover:text-accent transition-colors">FAQ</Link></li>
                            <li><Link to="/help#ordertracking" className="hover:text-accent transition-colors">Order Tracking</Link></li>
                            <li><Link to="/help#warranty" className="hover:text-accent transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-dark uppercase tracking-widest text-xs mb-8">Newsletter</h4>
                        <p className="text-dark/60 text-sm mb-6 leading-relaxed">
                            Stay updated with our latest collections and exclusive offers.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-card border border-soft/50 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:border-accent transition-colors text-dark"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white dark:text-night p-2.5 rounded-xl hover:bg-dark hover:text-white dark:hover:text-night transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-dark/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-dark/40 font-medium uppercase tracking-widest">
                    <p>© 2024 Furnit. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/help#getting-started" className="hover:text-dark">Privacy Policy</Link>
                        <Link to="/help#getting-started" className="hover:text-dark">Terms of Service</Link>
                        <Link to="/help#getting-started" className="hover:text-dark">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
