import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingOverlay = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
                >
                    <div className="text-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-16 h-16 mx-auto mb-6"
                        >
                            <div className="w-full h-full border-4 border-soft border-t-accent rounded-full"></div>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-serif font-bold text-dark"
                        >
                            furnit.
                        </motion.h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
