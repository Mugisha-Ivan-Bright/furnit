import React from 'react';
import { motion } from 'framer-motion';

const categories = [
    { name: 'Sofas', icon: '🛋️' },
    { name: 'Chairs', icon: '🪑' },
    { name: 'Tables', icon: '🍷' },
    { name: 'Lighting', icon: '💡' },
    { name: 'Storage', icon: '📦' },
    { name: 'Beds', icon: '🛏️' },
    { name: 'Decor', icon: '🖼️' },
];

const CategoryBar = () => {
    return (
        <div className="py-12 bg-background px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex overflow-hidden relative">
                <motion.div
                    className="flex flex-nowrap gap-4"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 20,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...categories, ...categories].map((cat, idx) => (
                        <button
                            key={idx}
                            className="flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-soft hover:bg-dark hover:text-white dark:hover:text-night rounded-2xl transition-all duration-300 group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                            <span className="font-semibold text-sm uppercase tracking-wide">{cat.name}</span>
                        </button>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default CategoryBar;
