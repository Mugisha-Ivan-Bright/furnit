import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Showcase = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto rounded-[48px] bg-dark dark:bg-night overflow-hidden relative min-h-[500px] flex flex-col lg:flex-row shadow-2xl transition-colors duration-500">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                    <span className="text-[200px] font-serif font-black uppercase tracking-tighter">PREMIUM</span>
                </div>

                <div className="flex-1 p-12 md:p-20 flex flex-col justify-center space-y-8 z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                        The <span className="text-accent italic">Luxury</span> You <br /> Deserve.
                    </h2>
                    <p className="text-white/40 text-lg max-w-sm leading-relaxed">
                        Every piece is crafted with meticulous attention to detail and a passion for exceptional design.
                    </p>
                    <div className="flex items-center gap-6 pt-4">
                        <button className="flex items-center gap-3 text-white font-bold group">
                            View the Collection
                            <span className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-300"
                                onClick={() => navigate('/products')}>
                                <ArrowRight size={20} />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative min-h-[400px] lg:min-h-auto overflow-hidden">
                    <img
                        src="/assets/collection.png"
                        alt="Designer Collection"
                        className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/20 to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default Showcase;
