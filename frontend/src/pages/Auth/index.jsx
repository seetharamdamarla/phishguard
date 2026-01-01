import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, verifyOTP, resendOTP, user } = useAuth();

    // OTP Refs
    const otpInputRefs = useRef([]);

    const [isLogin, setIsLogin] = useState(location.pathname === '/login');
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailForOTP, setEmailForOTP] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: ''
    });

    // Individual OTP digits state
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
        setError('');
        setSuccessMessage('');
        setShowOTP(false);
        setFormData(prev => ({ ...prev, otp: '' }));
        setOtpDigits(['', '', '', '', '', '']);
    }, [location.pathname]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle OTP Box Changes
    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            // Handle pasting implies taking last char if manually typed, but usually just takes 1
            value = value.slice(-1);
        }

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Update main formData otp string
        setFormData(prev => ({
            ...prev,
            otp: newOtpDigits.join('')
        }));

        // Move focus to next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Move to previous on Backspace if empty
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.length > 0) {
            const newOtpDigits = [...otpDigits];
            pastedData.forEach((char, i) => {
                if (i < 6) newOtpDigits[i] = char;
            });
            setOtpDigits(newOtpDigits);
            setFormData(prev => ({
                ...prev,
                otp: newOtpDigits.join('')
            }));
            // Focus last filled or last input
            const focusIndex = Math.min(pastedData.length, 5);
            otpInputRefs.current[focusIndex]?.focus();
        }
    };

    const handleResendOTP = async (_) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const result = await resendOTP(emailForOTP);
            if (result.success) {
                setSuccessMessage('OTP sent successfully to ' + emailForOTP);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (showOTP) {
                // Ensure full OTP
                if (formData.otp.length !== 6) {
                    setError('Please enter the full 6-digit code');
                    setLoading(false);
                    return;
                }
                const result = await verifyOTP(emailForOTP, formData.otp);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message);
                }
            } else if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                } else if (result.requiresVerification) {
                    setEmailForOTP(result.email || formData.email);
                    setShowOTP(true);
                    setSuccessMessage('Please verify your email to continue');
                } else {
                    setError(result.message);
                }
            } else {
                // Client-side validation for registration
                if (!formData.name.trim()) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }

                const result = await register(formData.name, formData.email, formData.password);

                if (result.success) {
                    setEmailForOTP(result.email || formData.email);
                    setShowOTP(true);
                    setSuccessMessage('Account created! Please enter the OTP sent to your email.');
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Global Toast Notification - High Z-index matched key for re-renders */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 pointer-events-none">
                <AnimatePresence mode='wait'>
                    {(error || successMessage) && (
                        <motion.div
                            key={error || successMessage} // Force re-render on message change
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${error
                                ? 'bg-red-500/90 border-red-400/50 text-white'
                                : 'bg-emerald-500/90 border-emerald-400/50 text-white'
                                }`}
                        >
                            <div className={`p-2 rounded-full shrink-0 ${error ? 'bg-white/20' : 'bg-white/20'}`}>
                                {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 text-sm font-medium">
                                {error || successMessage}
                            </div>
                            <button
                                onClick={() => {
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Application Layout */}
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative z-10">
                {/* Fixed Background Layer */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Content Container */}
                <div className="w-full max-w-md relative z-10">
                    {/* Logo Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">PhishGuard</h1>
                        <p className="text-blue-200/60 font-medium">Advanced Security Platform</p>
                    </motion.div>

                    {/* Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Glass Reflection Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                        {/* Content Header */}
                        <div className="mb-6 relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {showOTP
                                    ? 'Verify Authorization'
                                    : (isLogin ? 'Welcome Back' : 'Create Account')}
                            </h2>
                            <p className="text-blue-200/60 text-sm">
                                {showOTP
                                    ? `Enter the 6-digit code sent to ${emailForOTP}`
                                    : (isLogin ? 'Enter your credentials to access the secure dashboard' : 'Get started with advanced phishing protection')}
                            </p>
                        </div>



                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {showOTP ? (
                                <div className="space-y-4">
                                    <label className="text-white/80 text-sm font-medium ml-1">Verification Code</label>
                                    <div className="flex gap-2 justify-between">
                                        {otpDigits.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => {
                                                    if (el) otpInputRefs.current[index] = el;
                                                }}
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={handleOtpPaste}
                                                maxLength={1}
                                                className="w-12 h-14 bg-white/5 border border-white/20 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={loading}
                                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!isLogin && (
                                        <div className="space-y-2">
                                            <label className="text-white/80 text-sm font-medium ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-white/80 text-sm font-medium ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@company.com"
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-white/80 text-sm font-medium ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>
                                        {showOTP
                                            ? 'Verify & Access'
                                            : (isLogin ? 'Sign In' : 'Create Secure Account')}
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Bottom Auth Switch */}
                        {!showOTP ? (
                            <div className="mt-6 text-center">
                                <p className="text-white/60 text-sm">
                                    {isLogin ? "Don't have an account yet?" : "Already have an account?"}{' '}
                                    <button
                                        onClick={() => navigate(isLogin ? '/signup' : '/login')}
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
                                    >
                                        {isLogin ? 'Create one now' : 'Sign in here'}
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => {
                                        setShowOTP(false);
                                        setSuccessMessage('');
                                        setError('');
                                        setOtpDigits(['', '', '', '', '', '']);
                                        setFormData(prev => ({ ...prev, otp: '' }));
                                    }}
                                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                                >
                                    ← Back to {isLogin ? 'Login' : 'Signup'}
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Footer Security Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                                End-to-End Encrypted Session
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
