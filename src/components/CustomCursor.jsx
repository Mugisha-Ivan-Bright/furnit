import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    // We'll use more sophisticated spring settings for a buttery smooth feel
    const mouseX = useSpring(0, { stiffness: 400, damping: 30 });
    const mouseY = useSpring(0, { stiffness: 400, damping: 30 });

    const ringX = useSpring(0, { stiffness: 100, damping: 25 });
    const ringY = useSpring(0, { stiffness: 100, damping: 25 });

    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
            ringX.set(clientX);
            ringY.set(clientY);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.closest('button, a, input, select, textarea, [role="button"]');
            setIsHovering(!!isClickable);
        };

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseX, mouseY, ringX, ringY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block overflow-hidden">
            {/* Main Outer Ring (The "Inverter") */}
            <motion.div
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovering ? 80 : 40,
                    height: isHovering ? 80 : 40,
                    backgroundColor: isHovering ? 'rgba(251, 146, 60, 0.15)' : 'rgba(255, 255, 255, 0)',
                    border: isHovering ? '1px solid rgba(251, 146, 60, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)',
                    scale: isMouseDown ? 0.8 : 1,
                }}
                className="fixed top-0 left-0 rounded-full flex items-center justify-center transition-colors duration-300"
            >
                {/* Secondary trailing ball (The requested Orange one) */}
                <motion.div
                    animate={{
                        scale: isHovering ? 2 : 1,
                        backgroundColor: '#FF7043',
                        opacity: isHovering ? 0.8 : 0.4
                    }}
                    className="w-4 h-4 rounded-full blur-[1px]"
                />
            </motion.div>

            {/* Precision Inner Dot (Black) */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovering ? 4 : 8,
                    height: isHovering ? 4 : 8,
                    backgroundColor: '#000000',
                    scale: isMouseDown ? 1.5 : 1,
                }}
                className="fixed top-0 left-0 rounded-full shadow-2xl z-10"
            />
        </div>
    );
};

export default CustomCursor;
