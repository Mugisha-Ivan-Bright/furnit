import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw, Star, Plus, Minus, Check } from 'lucide-react';

// Extended product data with full details
const allProducts = [
    {
        id: 1,
        name: 'Scandi Lounge Chair',
        price: 890.00,
        image: '/assets/chair.png',
        images: ['/assets/chair.png', '/assets/hero.png', '/assets/collection.png'],
        category: 'Chairs',
        tag: 'Popular',
        description: 'Experience ultimate comfort with our Scandi Lounge Chair. Crafted with premium materials and timeless Scandinavian design, this chair is perfect for any modern living space.',
        features: [
            'Premium oak wood frame',
            'High-density foam cushioning',
            'Removable and washable covers',
            'Weight capacity: 300 lbs',
            'Dimensions: 32"W x 35"D x 38"H'
        ],
        materials: 'Solid oak wood, premium fabric upholstery, high-density foam',
        colors: ['Beige', 'Gray', 'Navy Blue'],
        inStock: true,
        rating: 4.9,
        reviews: 127
    },
    {
        id: 2,
        name: 'Mineral Side Table',
        price: 450.00,
        image: '/assets/collection.png',
        images: ['/assets/collection.png', '/assets/chair.png', '/assets/hero.png'],
        category: 'Tables',
        tag: 'New',
        description: 'A stunning side table featuring a natural mineral top and sleek metal base. Perfect for adding a touch of elegance to any room.',
        features: [
            'Natural marble top',
            'Powder-coated steel base',
            'Easy to clean surface',
            'Weight capacity: 50 lbs',
            'Dimensions: 18"W x 18"D x 22"H'
        ],
        materials: 'Natural marble, powder-coated steel',
        colors: ['White Marble', 'Black Marble', 'Green Marble'],
        inStock: true,
        rating: 4.8,
        reviews: 89
    },
    {
        id: 3,
        name: 'Soft Boucle Sofa',
        price: 2400.00,
        image: '/assets/hero.png',
        images: ['/assets/hero.png', '/assets/collection.png', '/assets/chair.png'],
        category: 'Sofas',
        tag: 'Limited',
        description: 'Luxurious boucle sofa that combines comfort and style. The soft texture and modern silhouette make it the centerpiece of any living room.',
        features: [
            'Premium boucle fabric',
            'Solid hardwood frame',
            'Deep seating for comfort',
            'Seats 3 people comfortably',
            'Dimensions: 84"W x 38"D x 32"H'
        ],
        materials: 'Boucle fabric, solid hardwood frame, high-resilience foam',
        colors: ['Cream', 'Charcoal', 'Sage Green'],
        inStock: true,
        rating: 5.0,
        reviews: 203
    },
    {
        id: 4,
        name: 'Nordic Floor Lamp',
        price: 320.00,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'],
        category: 'Lighting',
        description: 'Minimalist floor lamp with adjustable arm and warm LED lighting. Perfect for reading corners and ambient lighting.',
        features: [
            'Adjustable arm and head',
            'Warm LED bulb included',
            'Weighted base for stability',
            'Touch dimmer control',
            'Height: 65 inches'
        ],
        materials: 'Powder-coated metal, fabric shade',
        colors: ['Matte Black', 'Brass', 'White'],
        inStock: true,
        rating: 4.7,
        reviews: 64
    },
    {
        id: 5,
        name: 'Minimalist Shelf',
        price: 580.00,
        image: 'https://images.unsplash.com/photo-1594620302200-9a762194a956?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1594620302200-9a762194a956?auto=format&fit=crop&q=80&w=800'],
        category: 'Storage',
        description: 'Clean-lined wall shelf system perfect for displaying books, plants, and decorative items. Modular design allows for customization.',
        features: [
            'Modular design',
            'Easy wall mounting',
            'Solid wood construction',
            'Weight capacity: 40 lbs per shelf',
            'Dimensions: 48"W x 10"D x 60"H'
        ],
        materials: 'Solid oak wood, metal brackets',
        colors: ['Natural Oak', 'Walnut', 'White Oak'],
        inStock: true,
        rating: 4.6,
        reviews: 52
    },
    {
        id: 6,
        name: 'Velvet Armchair',
        price: 1100.00,
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'],
        category: 'Chairs',
        description: 'Elegant velvet armchair with gold-finished legs. A statement piece that adds luxury to any space.',
        features: [
            'Plush velvet upholstery',
            'Gold-finished metal legs',
            'High-density foam padding',
            'Weight capacity: 280 lbs',
            'Dimensions: 30"W x 32"D x 35"H'
        ],
        materials: 'Velvet fabric, metal legs, foam padding',
        colors: ['Emerald Green', 'Navy Blue', 'Blush Pink'],
        inStock: true,
        rating: 4.9,
        reviews: 145
    }
];

const ProductDetail = ({ onAddToCart, cartItems = [], onRemove }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = allProducts.find(p => p.id === parseInt(id));

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Check if product is in cart
    const isInCart = cartItems.some(item => item.id === product?.id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-dark mb-4">Product not found</h2>
                    <Link to="/products" className="text-accent hover:underline">Back to Products</Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        // Create a cart-compatible product object
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: `$${product.price.toFixed(2)}`,
            image: product.image,
            category: product.category,
            tag: product.tag
        };

        for (let i = 0; i < quantity; i++) {
            onAddToCart(cartProduct);
        }
        navigate('/cart');
    };

    const handleRemoveFromCart = () => {
        onRemove(product.id);
    };

    return (
        <div className="pt-32 pb-20 px-6 bg-background min-h-screen transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-dark/60 mb-8"
                >
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-dark font-bold">{product.name}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="sticky top-32">
                            <div className="aspect-square rounded-[40px] overflow-hidden bg-soft mb-6 relative">
                                <img
                                    src={product.images?.[selectedImage] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.tag && (
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-white dark:text-night rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        {product.tag}
                                    </div>
                                )}
                                <button className="absolute top-6 right-6 p-3 glass rounded-full text-dark hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-accent' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <p className="text-accent font-bold uppercase tracking-[0.2em] text-xs mb-2">{product.category}</p>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < Math.floor(product.rating || 0) ? 'fill-accent text-accent' : 'text-dark/20'}
                                        />
                                    ))}
                                </div>
                                <span className="text-dark/60 text-sm">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            <div className="text-4xl font-serif font-bold text-dark mb-6">
                                ${product.price.toFixed(2)}
                            </div>

                            <p className="text-dark/60 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Color Selection */}
                        {product.colors && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-dark mb-4">
                                    Color: <span className="text-accent">{product.colors[selectedColor]}</span>
                                </h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(idx)}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${selectedColor === idx
                                                ? 'bg-accent text-white dark:text-night'
                                                : 'bg-soft text-dark hover:bg-dark hover:text-white dark:hover:text-night'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        {!isInCart && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-dark mb-4">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-soft rounded-2xl">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-4 hover:text-accent transition-colors"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="px-6 font-bold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-4 hover:text-accent transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    {product.inStock && (
                                        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                                            <Check size={18} />
                                            In Stock
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            {isInCart ? (
                                <button
                                    onClick={handleRemoveFromCart}
                                    className="flex-1 bg-red-500 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    <Minus size={20} />
                                    Remove from Cart
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-accent text-white dark:text-night py-5 rounded-2xl font-bold hover:bg-dark hover:text-white dark:hover:text-night transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-accent/20"
                                >
                                    Add to Cart
                                </button>
                            )}
                            <button className="p-5 bg-soft rounded-2xl hover:bg-dark hover:text-white dark:hover:text-night transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-soft">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Truck size={20} className="text-accent" />
                                </div>
                                <p className="text-xs font-bold text-dark">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                                    <RotateCcw size={20} className="text-accent" />
                                </div>
                                <p className="text-xs font-bold text-dark">30-Day Returns</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-soft rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield size={20} className="text-accent" />
                                </div>
                                <p className="text-xs font-bold text-dark">5-Year Warranty</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="flex gap-8 border-b border-soft mb-8">
                        {['description', 'features', 'materials'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-bold uppercase tracking-widest text-sm transition-colors ${activeTab === tab
                                    ? 'text-accent border-b-2 border-accent'
                                    : 'text-dark/40 hover:text-dark'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-soft rounded-3xl p-12">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-dark mb-4">Product Description</h3>
                                <p className="text-dark/60 leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-dark mb-6">Key Features</h3>
                                <ul className="space-y-4">
                                    {product.features?.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-dark/60">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'materials' && (
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-dark mb-4">Materials & Care</h3>
                                <p className="text-dark/60 leading-relaxed mb-6">{product.materials}</p>
                                <div className="bg-white rounded-2xl p-6">
                                    <h4 className="font-bold text-dark mb-3">Care Instructions:</h4>
                                    <ul className="space-y-2 text-dark/60 text-sm">
                                        <li>• Wipe clean with a soft, damp cloth</li>
                                        <li>• Avoid harsh chemicals and abrasive cleaners</li>
                                        <li>• Keep away from direct sunlight to prevent fading</li>
                                        <li>• Professional cleaning recommended for upholstery</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
