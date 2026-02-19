import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import '../nprogress-custom.css';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.3,
    easing: 'ease',
    speed: 500
});

const PageLoader = () => {
    const location = useLocation();

    useEffect(() => {
        // Start loading when route changes
        NProgress.start();

        // Complete loading after a short delay
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300);

        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [location.pathname]);

    return null;
};

export default PageLoader;
