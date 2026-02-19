import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { signIn, signInWithGoogle, isAuthenticated } = useAuth();
    const [loginMessage, setLoginMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate('/dashboard');
        }

        // Check if there's a message from redirect
        const message = sessionStorage.getItem('loginMessage');
        if (message) {
            setLoginMessage(message);
            setTimeout(() => {
                sessionStorage.removeItem('loginMessage');
            }, 100);
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);

            // Check if there's a redirect path
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 relative bg-soft overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-dark/20"></div>
                <img
                    src="/assets/hero.png"
                    alt="Furniture Collection"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-16 bg-gradient-to-t from-dark/80 to-transparent">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-serif font-bold text-white mb-4">
                            Welcome Back to Furnit
                        </h2>
                        <p className="text-white/80 text-lg max-w-md leading-relaxed">
                            Continue your journey to create the perfect living space with our curated collection of premium furniture.
                        </p>
                        <div className="flex items-center gap-8 mt-8">
                            <div>
                                <div className="text-3xl font-serif font-bold text-white">500k+</div>
                                <div className="text-xs uppercase tracking-wider text-white/60">Happy Clients</div>
                            </div>
                            <div className="w-[1px] h-10 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-serif font-bold text-white">2.5k</div>
                                <div className="text-xs uppercase tracking-wider text-white/60">Products</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col lg:items-center lg:justify-center px-6 pt-32 lg:pt-12 pb-12 bg-background relative min-h-screen lg:min-h-0 overflow-y-auto lg:overflow-visible transition-colors duration-500">
                <Link to="/" className="absolute top-12 lg:top-8 left-8 flex items-center gap-2 text-dark/60 hover:text-dark transition-colors font-bold uppercase tracking-widest text-xs z-10">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif font-bold text-dark mb-3">Welcome Back</h2>
                        <p className="text-dark/60">Please enter your details to sign in.</p>
                    </div>

                    {/* Alert Messages */}
                    <AnimatePresence>
                        {loginMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-start gap-3"
                            >
                                <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-orange-900 mb-1">Authentication Required</p>
                                    <p className="text-sm text-orange-700">{loginMessage}</p>
                                </div>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3"
                            >
                                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-900 mb-1">Error</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-card border-2 border-soft px-6 py-4 rounded-2xl font-bold text-dark hover:border-dark transition-all duration-300 mb-8"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6109C15.3727 13.3 14.6636 14.3591 13.6045 15.0682V17.5773H16.8273C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4" />
                            <path d="M10.2 20C12.9 20 15.1709 19.1045 16.8273 17.5773L13.6045 15.0682C12.7091 15.6682 11.5636 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58636 11.9H1.25455V14.4909C2.90182 17.7591 6.30909 20 10.2 20Z" fill="#34A853" />
                            <path d="M4.58636 11.9C4.38636 11.3 4.27273 10.6591 4.27273 10C4.27273 9.34091 4.38636 8.7 4.58636 8.1V5.50909H1.25455C0.572727 6.85909 0.2 8.38636 0.2 10C0.2 11.6136 0.572727 13.1409 1.25455 14.4909L4.58636 11.9Z" fill="#FBBC04" />
                            <path d="M10.2 3.97727C11.6864 3.97727 13.0182 4.48182 14.0636 5.47273L16.9182 2.61818C15.1664 0.986364 12.8955 0 10.2 0C6.30909 0 2.90182 2.24091 1.25455 5.50909L4.58636 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-soft"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-dark/40 font-bold tracking-widest transition-colors duration-500">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-dark/60 mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/40" />
                                <input
                                    type="email"
                                    placeholder="hello@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-soft border-none pl-14 pr-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-dark/60 mb-2 px-1">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/40" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-soft border-none pl-14 pr-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-soft text-accent focus:ring-accent" />
                                <span className="text-xs text-dark/60">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-xs font-bold text-accent hover:text-dark transition-colors">Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark text-white dark:text-night py-5 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-dark/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-dark/60">
                            Don't have an account? <Link to="/signup" className="text-dark font-bold hover:text-accent transition-colors underline underline-offset-4">Create one</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
