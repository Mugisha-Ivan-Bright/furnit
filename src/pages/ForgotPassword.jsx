import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { sendPasswordResetEmail } from '../utils/emailService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Send request to our Nodemailer server
            // Server will check if user exists in Supabase and send email
            const result = await sendPasswordResetEmail(email);

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Failed to send reset email. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
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
                    src="/assets/collection.png"
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
                            Reset Your Password
                        </h2>
                        <p className="text-white/80 text-lg max-w-md leading-relaxed">
                            Don't worry, it happens to the best of us. Enter your email address and we'll send you instructions to reset your password.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">1</div>
                                <span className="text-white/90">Enter your email address</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">2</div>
                                <span className="text-white/90">Check your inbox for reset link</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">3</div>
                                <span className="text-white/90">Create a new password</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col lg:items-center lg:justify-center px-6 pt-32 lg:pt-12 pb-12 bg-background relative min-h-screen lg:min-h-0 overflow-y-auto lg:overflow-visible transition-colors duration-500">
                <Link to="/login" className="absolute top-12 lg:top-8 left-8 flex items-center gap-2 text-dark/60 hover:text-dark transition-colors font-bold uppercase tracking-widest text-xs z-10">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {!success ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail size={40} className="text-accent" />
                                </div>
                                <h2 className="text-4xl font-serif font-bold text-dark mb-3">Forgot Password?</h2>
                                <p className="text-dark/60">No worries, we'll send you reset instructions.</p>
                            </div>

                            {/* Alert Messages */}
                            <AnimatePresence>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-dark text-white dark:text-night py-5 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-dark/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-dark mb-3">Check Your Email</h2>
                            <p className="text-dark/60 mb-6 leading-relaxed">
                                We've sent a password reset link to <span className="font-bold text-dark">{email}</span>
                            </p>
                            <div className="bg-soft border-2 border-soft rounded-2xl p-6 mb-8">
                                <p className="text-sm text-dark/70 leading-relaxed">
                                    Click the link in the email to reset your password. The link will expire in 1 hour for security reasons.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-dark/60">
                                    Didn't receive the email? Check your spam folder or{' '}
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="text-accent font-bold hover:text-dark underline"
                                    >
                                        try again
                                    </button>
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-dark font-bold hover:text-accent transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
