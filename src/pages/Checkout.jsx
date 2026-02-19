import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MapPin, Calendar, MessageSquare, CreditCard,
    CheckCircle, AlertCircle, Package, Truck, Clock,
    Phone, Mail, User, Home, Building2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    validateEmail,
    validateRwandaPhone,
    validateBankAccount,
    validateFullName,
    validateDeliveryDate,
    normalizePhone,
    validateAddress,
    sanitizeInput
} from '../utils/validation';
import { sendOrderConfirmationEmail } from '../utils/emailService';

const Checkout = ({ cartItems, onClearCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    // Form states
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Customer Information
    const [customerInfo, setCustomerInfo] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
    });

    // Delivery Information
    const [deliveryInfo, setDeliveryInfo] = useState({
        address: '',
        city: 'Kigali',
        district: '',
        sector: '',
        deliveryDate: '',
        deliveryTime: 'morning',
        specialInstructions: '',
    });


    // Payment Information
    const [paymentInfo, setPaymentInfo] = useState({
        method: 'momo',
        momoNumber: '',
        momoProvider: 'MTN',
        bankAccount: '',
        bankName: 'Bank of Kigali',
    });

    // Order tracking
    const [orderNotes, setOrderNotes] = useState('');

    // Rwanda districts and sectors
    const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
    const sectors = {
        'Gasabo': ['Bumbogo', 'Gatsata', 'Jali', 'Gikomero', 'Gisozi', 'Jabana', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'],
        'Kicukiro': ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
        'Nyarugenge': ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo']
    };

    useEffect(() => {
        if (!isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            sessionStorage.setItem('loginMessage', 'Please login to proceed with checkout');
            navigate('/login');
        }

        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [isAuthenticated, cartItems, navigate]);

    // Calculate totals
    const subtotal = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const deliveryFee = subtotal > 1000 ? 0 : 50;
    const total = subtotal + deliveryFee;


    const handleSubmitOrder = async () => {
        setError('');
        setLoading(true);

        try {
            // Final comprehensive validation

            // Customer Information Validation
            if (!customerInfo.fullName.trim()) {
                throw new Error('Please enter your full name');
            }

            if (!validateFullName(customerInfo.fullName)) {
                throw new Error('Please enter your full name (first and last name)');
            }

            if (!customerInfo.email.trim()) {
                throw new Error('Please enter your email address');
            }

            if (!validateEmail(customerInfo.email)) {
                throw new Error('Please enter a valid email address');
            }

            if (!customerInfo.phone.trim()) {
                throw new Error('Please enter your phone number');
            }

            if (!validateRwandaPhone(customerInfo.phone)) {
                throw new Error('Please enter a valid Rwanda phone number');
            }

            // Delivery Information Validation
            if (!deliveryInfo.address.trim()) {
                throw new Error('Please enter your delivery address');
            }

            if (deliveryInfo.address.trim().length < 10) {
                throw new Error('Please enter a complete delivery address');
            }

            if (!deliveryInfo.district) {
                throw new Error('Please select a district');
            }

            if (!deliveryInfo.sector) {
                throw new Error('Please select a sector');
            }

            if (!deliveryInfo.deliveryDate) {
                throw new Error('Please select a delivery date');
            }

            const dateValidation = validateDeliveryDate(deliveryInfo.deliveryDate);
            if (!dateValidation.valid) {
                throw new Error(dateValidation.message);
            }

            // Payment Information Validation
            if (paymentInfo.method === 'momo') {
                if (!paymentInfo.momoNumber.trim()) {
                    throw new Error('Please enter your Mobile Money number');
                }

                if (!validateRwandaPhone(paymentInfo.momoNumber)) {
                    throw new Error('Please enter a valid Mobile Money number');
                }
            }

            if (paymentInfo.method === 'bank') {
                if (!paymentInfo.bankAccount.trim()) {
                    throw new Error('Please enter your bank account number');
                }

                if (!validateBankAccount(paymentInfo.bankAccount)) {
                    throw new Error('Please enter a valid bank account number (10-16 digits)');
                }
            }

            // Normalize phone numbers (remove spaces, ensure +250 prefix)
            const normalizePhone = (phone) => {
                let cleaned = phone.replace(/\s/g, '');
                if (cleaned.startsWith('0')) {
                    cleaned = '+250' + cleaned.substring(1);
                } else if (!cleaned.startsWith('+')) {
                    cleaned = '+' + cleaned;
                }
                return cleaned;
            };

            const normalizedCustomerPhone = normalizePhone(customerInfo.phone);
            const normalizedPaymentPhone = paymentInfo.method === 'momo' ? normalizePhone(paymentInfo.momoNumber) : null;

            // Create order object
            const orderData = {
                user_id: user.id,
                customer_name: customerInfo.fullName.trim(),
                customer_email: customerInfo.email.trim().toLowerCase(),
                customer_phone: normalizedCustomerPhone,
                delivery_address: deliveryInfo.address.trim(),
                delivery_city: deliveryInfo.city,
                delivery_district: deliveryInfo.district,
                delivery_sector: deliveryInfo.sector,
                delivery_date: deliveryInfo.deliveryDate,
                delivery_time: deliveryInfo.deliveryTime,
                special_instructions: deliveryInfo.specialInstructions.trim() || null,
                payment_method: paymentInfo.method,
                payment_details: paymentInfo.method === 'momo'
                    ? `${paymentInfo.momoProvider} - ${normalizedPaymentPhone}`
                    : `${paymentInfo.bankName} - ${paymentInfo.bankAccount.replace(/\s/g, '')}`,
                order_notes: orderNotes.trim() || null,
                subtotal: subtotal,
                delivery_fee: deliveryFee,
                total: total,
                status: 'pending',
                items: cartItems,
                created_at: new Date().toISOString(),
            };


            // Insert order into Supabase
            const { data, error: insertError } = await supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (insertError) throw insertError;

            // Send order confirmation email (don't wait for it)
            sendOrderConfirmationEmail(data[0]).catch(err => {
                console.error('Failed to send order confirmation email:', err);
                // Email failure shouldn't break the order flow
            });

            // Clear cart and show success
            setSuccess(true);
            onClearCart();

            // Redirect to order confirmation after 3 seconds
            setTimeout(() => {
                navigate('/dashboard', { state: { orderPlaced: true, orderId: data[0].id } });
            }, 3000);

        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const nextStep = () => {
        setError('');

        if (step === 1) {
            // Validate customer information
            if (!customerInfo.fullName.trim()) {
                setError('Please enter your full name');
                return;
            }

            if (!validateFullName(customerInfo.fullName)) {
                setError('Please enter your full name (first and last name)');
                return;
            }

            if (!customerInfo.email.trim()) {
                setError('Please enter your email address');
                return;
            }

            if (!validateEmail(customerInfo.email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (!customerInfo.phone.trim()) {
                setError('Please enter your phone number');
                return;
            }

            if (!validateRwandaPhone(customerInfo.phone)) {
                setError('Please enter a valid Rwanda phone number (e.g., +250 7XX XXX XXX or 07XX XXX XXX)');
                return;
            }
        }

        if (step === 2) {
            // Validate delivery information
            if (!deliveryInfo.address.trim()) {
                setError('Please enter your delivery address');
                return;
            }

            if (deliveryInfo.address.trim().length < 10) {
                setError('Please enter a complete delivery address (at least 10 characters)');
                return;
            }

            if (!deliveryInfo.district) {
                setError('Please select a district');
                return;
            }

            if (!deliveryInfo.sector) {
                setError('Please select a sector');
                return;
            }

            if (!deliveryInfo.deliveryDate) {
                setError('Please select a delivery date');
                return;
            }

            const dateValidation = validateDeliveryDate(deliveryInfo.deliveryDate);
            if (!dateValidation.valid) {
                setError(dateValidation.message);
                return;
            }
        }

        if (step === 3) {
            // Validate payment information
            if (paymentInfo.method === 'momo') {
                if (!paymentInfo.momoNumber.trim()) {
                    setError('Please enter your Mobile Money number');
                    return;
                }

                if (!validateRwandaPhone(paymentInfo.momoNumber)) {
                    setError('Please enter a valid Mobile Money number (e.g., +250 7XX XXX XXX)');
                    return;
                }
            }

            if (paymentInfo.method === 'bank') {
                if (!paymentInfo.bankAccount.trim()) {
                    setError('Please enter your bank account number');
                    return;
                }

                if (!validateBankAccount(paymentInfo.bankAccount)) {
                    setError('Please enter a valid bank account number (10-16 digits)');
                    return;
                }
            }
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        setValidationErrors({});
        setStep(step - 1);
    };

    // Real-time validation handlers
    const handlePhoneBlur = (field) => {
        const phone = field === 'customer' ? customerInfo.phone : paymentInfo.momoNumber;
        if (phone && !validateRwandaPhone(phone)) {
            setValidationErrors(prev => ({
                ...prev,
                [field + 'Phone']: 'Invalid Rwanda phone number format'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field + 'Phone'];
                return newErrors;
            });
        }
    };

    const handleEmailBlur = () => {
        if (customerInfo.email && !validateEmail(customerInfo.email)) {
            setValidationErrors(prev => ({
                ...prev,
                email: 'Invalid email address'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
            });
        }
    };

    const handleBankAccountBlur = () => {
        if (paymentInfo.bankAccount && !validateBankAccount(paymentInfo.bankAccount)) {
            setValidationErrors(prev => ({
                ...prev,
                bankAccount: 'Invalid bank account number (10-16 digits required)'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.bankAccount;
                return newErrors;
            });
        }
    };

    const handleNameBlur = () => {
        if (customerInfo.fullName && !validateFullName(customerInfo.fullName)) {
            setValidationErrors(prev => ({
                ...prev,
                fullName: 'Please enter first and last name'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.fullName;
                return newErrors;
            });
        }
    };


    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-dark mb-4">Order Placed!</h2>
                    <p className="text-dark/60 mb-8 leading-relaxed">
                        Thank you for your order. We've sent a confirmation email to <span className="font-bold text-dark">{customerInfo.email}</span>
                    </p>
                    <div className="bg-soft border-2 border-soft rounded-2xl p-6 mb-8">
                        <p className="text-sm text-dark/70 leading-relaxed">
                            Your order is being processed. You'll receive updates via email and SMS. Track your order from your dashboard.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-dark text-white py-4 rounded-2xl font-bold hover:bg-accent transition-all duration-300"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-background py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-dark/60 hover:text-dark transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Cart
                    </button>
                    <h1 className="text-5xl font-serif font-bold text-dark mb-4">Checkout</h1>
                    <p className="text-dark/60">Complete your order in {4 - step} more steps</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {[
                            { num: 1, label: 'Customer Info', icon: User },
                            { num: 2, label: 'Delivery', icon: Truck },
                            { num: 3, label: 'Payment', icon: CreditCard },
                            { num: 4, label: 'Review', icon: CheckCircle }
                        ].map((s, idx) => (
                            <div key={s.num} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s.num
                                        ? 'bg-accent text-white'
                                        : 'bg-soft text-dark/40'
                                        }`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className={`text-xs mt-2 font-bold ${step >= s.num ? 'text-dark' : 'text-dark/40'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < 3 && (
                                    <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${step > s.num ? 'bg-accent' : 'bg-soft'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 max-w-3xl mx-auto"
                        >
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-900 mb-1">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-3xl p-8 shadow-lg"
                        >

                            {/* Step 1: Customer Information */}
                            {step === 1 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <User size={24} className="text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-dark">Customer Information</h2>
                                            <p className="text-sm text-dark/60">Your contact details</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Full Name</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                <input
                                                    type="text"
                                                    value={customerInfo.fullName}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                <input
                                                    type="email"
                                                    value={customerInfo.email}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                <input
                                                    type="tel"
                                                    value={customerInfo.phone}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    placeholder="+250 7XX XXX XXX"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Step 2: Delivery Information */}
                            {step === 2 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <Truck size={24} className="text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-dark">Delivery Information</h2>
                                            <p className="text-sm text-dark/60">Where and when to deliver</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Street Address</label>
                                            <div className="relative">
                                                <Home size={18} className="absolute left-4 top-4 text-dark/40" />
                                                <textarea
                                                    value={deliveryInfo.address}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none resize-none"
                                                    placeholder="KG 123 St, House #45"
                                                    rows="2"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    value={deliveryInfo.city}
                                                    className="w-full bg-soft border-none px-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">District</label>
                                                <select
                                                    value={deliveryInfo.district}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value, sector: '' })}
                                                    className="w-full bg-soft border-none px-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    required
                                                >
                                                    <option value="">Select District</option>
                                                    {districts.map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Sector</label>
                                                <select
                                                    value={deliveryInfo.sector}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, sector: e.target.value })}
                                                    className="w-full bg-soft border-none px-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    required
                                                    disabled={!deliveryInfo.district}
                                                >
                                                    <option value="">Select Sector</option>
                                                    {deliveryInfo.district && sectors[deliveryInfo.district]?.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Delivery Date</label>
                                                <div className="relative">
                                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                    <input
                                                        type="date"
                                                        value={deliveryInfo.deliveryDate}
                                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryDate: e.target.value })}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Preferred Time</label>
                                                <div className="relative">
                                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                    <select
                                                        value={deliveryInfo.deliveryTime}
                                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryTime: e.target.value })}
                                                        className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    >
                                                        <option value="morning">Morning (8AM - 12PM)</option>
                                                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                                                        <option value="evening">Evening (4PM - 8PM)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Special Instructions (Optional)</label>
                                            <div className="relative">
                                                <MessageSquare size={18} className="absolute left-4 top-4 text-dark/40" />
                                                <textarea
                                                    value={deliveryInfo.specialInstructions}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, specialInstructions: e.target.value })}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none resize-none"
                                                    placeholder="Any special delivery instructions? (e.g., gate code, landmarks)"
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Step 3: Payment Method */}
                            {step === 3 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <CreditCard size={24} className="text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-dark">Payment Method</h2>
                                            <p className="text-sm text-dark/60">Choose how to pay</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Payment Method Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({ ...paymentInfo, method: 'momo' })}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${paymentInfo.method === 'momo'
                                                    ? 'border-accent bg-accent/5'
                                                    : 'border-soft hover:border-accent/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                                        <Phone size={20} className="text-accent" />
                                                    </div>
                                                    <span className="font-bold text-dark">Mobile Money</span>
                                                </div>
                                                <p className="text-xs text-dark/60">Pay with MTN or Airtel Money</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({ ...paymentInfo, method: 'bank' })}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${paymentInfo.method === 'bank'
                                                    ? 'border-accent bg-accent/5'
                                                    : 'border-soft hover:border-accent/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                                        <Building2 size={20} className="text-accent" />
                                                    </div>
                                                    <span className="font-bold text-dark">Bank Transfer</span>
                                                </div>
                                                <p className="text-xs text-dark/60">Pay via Bank of Kigali</p>
                                            </button>
                                        </div>


                                        {/* Mobile Money Details */}
                                        {paymentInfo.method === 'momo' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Provider</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPaymentInfo({ ...paymentInfo, momoProvider: 'MTN' })}
                                                            className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentInfo.momoProvider === 'MTN'
                                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                                : 'border-soft hover:border-yellow-300'
                                                                }`}
                                                        >
                                                            MTN MoMo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPaymentInfo({ ...paymentInfo, momoProvider: 'Airtel' })}
                                                            className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentInfo.momoProvider === 'Airtel'
                                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                                : 'border-soft hover:border-red-300'
                                                                }`}
                                                        >
                                                            Airtel Money
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Mobile Money Number</label>
                                                    <div className="relative">
                                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                        <input
                                                            type="tel"
                                                            value={paymentInfo.momoNumber}
                                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, momoNumber: e.target.value })}
                                                            className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                            placeholder="+250 7XX XXX XXX"
                                                            required
                                                        />
                                                    </div>
                                                    <p className="text-xs text-dark/60 mt-2">You'll receive a payment prompt on this number</p>
                                                </div>
                                            </motion.div>
                                        )}


                                        {/* Bank Transfer Details */}
                                        {paymentInfo.method === 'bank' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Bank</label>
                                                    <select
                                                        value={paymentInfo.bankName}
                                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                                                        className="w-full bg-soft border-none px-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                    >
                                                        <option value="Bank of Kigali">Bank of Kigali</option>
                                                        <option value="Equity Bank">Equity Bank</option>
                                                        <option value="I&M Bank">I&M Bank</option>
                                                        <option value="KCB Bank">KCB Bank</option>
                                                        <option value="Cogebanque">Cogebanque</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Account Number</label>
                                                    <div className="relative">
                                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                                        <input
                                                            type="text"
                                                            value={paymentInfo.bankAccount}
                                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, bankAccount: e.target.value })}
                                                            className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                                                            placeholder="XXXX XXXX XXXX"
                                                            required
                                                        />
                                                    </div>
                                                    <p className="text-xs text-dark/60 mt-2">We'll send payment instructions to your email</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* Step 4: Review Order */}
                            {step === 4 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <Package size={24} className="text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-dark">Review Order</h2>
                                            <p className="text-sm text-dark/60">Confirm your details</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Customer Info Summary */}
                                        <div className="bg-soft rounded-2xl p-6">
                                            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                                                <User size={18} />
                                                Customer Information
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="text-dark/60">Name:</span> <span className="font-bold">{customerInfo.fullName}</span></p>
                                                <p><span className="text-dark/60">Email:</span> <span className="font-bold">{customerInfo.email}</span></p>
                                                <p><span className="text-dark/60">Phone:</span> <span className="font-bold">{customerInfo.phone}</span></p>
                                            </div>
                                        </div>

                                        {/* Delivery Info Summary */}
                                        <div className="bg-soft rounded-2xl p-6">
                                            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                                                <MapPin size={18} />
                                                Delivery Information
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="text-dark/60">Address:</span> <span className="font-bold">{deliveryInfo.address}</span></p>
                                                <p><span className="text-dark/60">Location:</span> <span className="font-bold">{deliveryInfo.sector}, {deliveryInfo.district}, {deliveryInfo.city}</span></p>
                                                <p><span className="text-dark/60">Date:</span> <span className="font-bold">{new Date(deliveryInfo.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                                                <p><span className="text-dark/60">Time:</span> <span className="font-bold capitalize">{deliveryInfo.deliveryTime}</span></p>
                                                {deliveryInfo.specialInstructions && (
                                                    <p><span className="text-dark/60">Instructions:</span> <span className="font-bold">{deliveryInfo.specialInstructions}</span></p>
                                                )}
                                            </div>
                                        </div>


                                        {/* Payment Info Summary */}
                                        <div className="bg-soft rounded-2xl p-6">
                                            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                                                <CreditCard size={18} />
                                                Payment Method
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="text-dark/60">Method:</span> <span className="font-bold capitalize">{paymentInfo.method === 'momo' ? 'Mobile Money' : 'Bank Transfer'}</span></p>
                                                {paymentInfo.method === 'momo' ? (
                                                    <>
                                                        <p><span className="text-dark/60">Provider:</span> <span className="font-bold">{paymentInfo.momoProvider}</span></p>
                                                        <p><span className="text-dark/60">Number:</span> <span className="font-bold">{paymentInfo.momoNumber}</span></p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p><span className="text-dark/60">Bank:</span> <span className="font-bold">{paymentInfo.bankName}</span></p>
                                                        <p><span className="text-dark/60">Account:</span> <span className="font-bold">{paymentInfo.bankAccount}</span></p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Notes */}
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider font-bold text-dark/60 mb-2">Order Notes (Optional)</label>
                                            <div className="relative">
                                                <MessageSquare size={18} className="absolute left-4 top-4 text-dark/40" />
                                                <textarea
                                                    value={orderNotes}
                                                    onChange={(e) => setOrderNotes(e.target.value)}
                                                    className="w-full bg-soft border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-accent outline-none resize-none"
                                                    placeholder="Any additional notes for your order?"
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-8">
                                {step > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex-1 bg-soft text-dark py-4 rounded-2xl font-bold hover:bg-dark/10 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} />
                                        Previous
                                    </button>
                                )}

                                {step < 4 ? (
                                    <button
                                        onClick={nextStep}
                                        className="flex-1 bg-dark text-white py-4 rounded-2xl font-bold hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Next
                                        <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={loading}
                                        className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold hover:bg-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                        <CheckCircle size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>


                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-3xl p-8 shadow-lg sticky top-24">
                            <h3 className="text-xl font-serif font-bold text-dark mb-6">Order Summary</h3>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cartItems?.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-xl"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-dark">{item.name}</h4>
                                            <p className="text-xs text-dark/60">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-accent">${item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-soft pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark/60">Subtotal</span>
                                    <span className="font-bold text-dark">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark/60">Delivery Fee</span>
                                    <span className="font-bold text-dark">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${deliveryFee.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t-2 border-soft pt-3 flex justify-between">
                                    <span className="font-bold text-dark">Total</span>
                                    <span className="font-bold text-2xl text-accent">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {deliveryFee === 0 && (
                                <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                                    <p className="text-xs text-green-700 font-bold">🎉 Free delivery on orders over $1000!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
