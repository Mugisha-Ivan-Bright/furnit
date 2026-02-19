import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block px-4 py-1.5 bg-soft rounded-full text-xs font-bold uppercase tracking-widest text-dark/60"
                    >
                        Spring Collection 2026
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-dark leading-[1.1]"
                    >
                        Elevate Your <br />
                        <span className="text-accent underline decoration-accent/20 underline-offset-8">Living Space</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-dark/60 max-w-lg leading-relaxed"
                    >
                        Discover our curated selection of modern furniture that blends timeless elegance with contemporary comfort.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        <Link
                            to="/products"
                            className="bg-accent text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-accent/20 hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                        >
                            <ShoppingBag size={20} />
                            View Collection
                            <ArrowRight size={20} />
                        </Link>
                        <button className="bg-background border-2 border-soft text-dark px-10 py-5 rounded-full font-bold hover:border-dark/20 transition-all duration-300">
                            View Lookbook
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="pt-12 flex items-center gap-8"
                    >
                        <div>
                            <div className="text-3xl font-serif font-bold text-dark">500k+</div>
                            <div className="text-xs uppercase tracking-wider text-dark/40">Happy Clients</div>
                        </div>
                        <div className="w-[1px] h-10 bg-soft"></div>
                        <div>
                            <div className="text-3xl font-serif font-bold text-dark">2.5k</div>
                            <div className="text-xs uppercase tracking-wider text-dark/40">Furniture Items</div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex-1 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <img
                            src="/assets/hero.png"
                            alt="Premium Living Room"
                            className="w-full h-auto rounded-[40px] shadow-2xl"
                        />
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-soft rounded-full -z-10"></div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 glass p-6 rounded-3xl shadow-xl z-20 max-w-[200px]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </div>
                            <div className="text-sm font-bold">4.9/5</div>
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-dark/60 font-medium">Customer Reviews</div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
