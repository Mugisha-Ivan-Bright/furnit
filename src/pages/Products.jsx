import React, { useState } from 'react';
import { Plus, Heart, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const allProducts = [
    {
        id: 1,
        name: 'Scandi Lounge Chair',
        price: '$890.00',
        image: '/assets/chair.png',
        category: 'Chairs',
        tag: 'Popular'
    },
    {
        id: 2,
        name: 'Mineral Side Table',
        price: '$450.00',
        image: '/assets/collection.png',
        category: 'Tables',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Soft Boucle Sofa',
        price: '$2,400.00',
        image: '/assets/hero.png',
        category: 'Sofas',
        tag: 'Limited'
    },
    {
        id: 4,
        name: 'Nordic Floor Lamp',
        price: '$320.00',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        category: 'Lighting'
    },
    {
        id: 5,
        name: 'Minimalist Shelf',
        price: '$580.00',
        image: 'https://images.unsplash.com/photo-1594620302200-9a762194a956?auto=format&fit=crop&q=80&w=800',
        category: 'Storage'
    },
    {
        id: 6,
        name: 'Velvet Armchair',
        price: '$1,100.00',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
        category: 'Chairs'
    },
    {
        id: 7,
        name: 'Oak Dining Table',
        price: '$1,850.00',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
        category: 'Tables',
        tag: 'New'
    },
    {
        id: 8,
        name: 'Leather Sectional',
        price: '$3,200.00',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        category: 'Sofas'
    },
    {
        id: 9,
        name: 'Modern Pendant Light',
        price: '$280.00',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
        category: 'Lighting',
        tag: 'Popular'
    },
    {
        id: 10,
        name: 'Upholstered Bed Frame',
        price: '$1,650.00',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
        category: 'Bedroom'
    },
    {
        id: 11,
        name: 'Marble Coffee Table',
        price: '$920.00',
        image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&q=80&w=800',
        category: 'Tables'
    },
    {
        id: 12,
        name: 'Accent Chair Set',
        price: '$1,450.00',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        category: 'Chairs',
        tag: 'Limited'
    }
];

const categories = ['All', 'Chairs', 'Tables', 'Sofas', 'Lighting', 'Storage', 'Bedroom'];

const Products = ({ onAddToCart }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter(product => product.category === selectedCategory);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 bg-background min-h-screen transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h4 className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Shop All</h4>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark italic mb-4">Our Complete Collection</h1>
                    <p className="text-dark/60 text-lg max-w-2xl mx-auto">
                        Explore our full range of premium furniture pieces designed to elevate every space in your home.
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                    : 'bg-soft text-dark hover:bg-dark hover:text-white dark:hover:text-night'
                                    }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-soft rounded-full font-bold text-sm hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300"
                        >
                            <SlidersHorizontal size={18} />
                            Sort
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-soft rounded-full font-bold text-sm hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300"
                        >
                            <Filter size={18} />
                            Filter
                        </motion.button>
                    </div>
                </motion.div>

                {/* Product Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8 text-dark/60 text-sm"
                >
                    Showing <span className="font-bold text-dark">{filteredProducts.length}</span> products
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    key={selectedCategory}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                >
                    {filteredProducts.map((product) => (
                        <motion.div key={product.id} variants={itemVariants} className="group relative">
                            <Link to={`/product/${product.id}`}>
                                <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-soft relative mb-6 cursor-pointer">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <button className="absolute top-6 right-6 p-3 glass rounded-full text-dark hover:text-red-500 transition-colors">
                                        <Heart size={20} />
                                    </button>
                                    {product.tag && (
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            {product.tag}
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-20 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 w-[calc(100%-48px)]">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onAddToCart(product);
                                            }}
                                            className="w-full bg-dark text-white dark:text-night py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            <Plus size={20} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <p className="text-dark/40 text-xs uppercase tracking-widest font-bold mb-1">{product.category}</p>
                                        <h3 className="text-xl font-bold text-dark group-hover:text-accent transition-colors">{product.name}</h3>
                                    </div>
                                    <div className="text-lg font-serif font-bold text-dark">{product.price}</div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Load More */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-dark text-white dark:text-night px-12 py-5 rounded-full font-bold hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Load More Products
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Products;
