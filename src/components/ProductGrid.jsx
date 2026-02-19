import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const products = [
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
    }
];

const ProductGrid = ({ onAddToCart }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-20 px-6 bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <h4 className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Our Collection</h4>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark italic">Featured Products</h2>
                    </div>
                    <Link to="/products" className="text-dark font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors">
                        View All Products
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {products.map((product) => (
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
            </div>
        </section>
    );
};

export default ProductGrid;
