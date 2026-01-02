import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
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
            value = value.slice(-1);
        }

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        setFormData(prev => ({
            ...prev,
            otp: newOtpDigits.join('')
        }));

        if (value && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
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
            {/* Toast Notification */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
                <AnimatePresence mode='wait'>
                    {(error || successMessage) && (
                        <motion.div
                            key={error || successMessage}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${error
                                ? 'bg-red-50 border-red-200 text-red-900'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                }`}
                        >
                            <div className={`p-2 rounded-lg shrink-0 ${error ? 'bg-red-100' : 'bg-emerald-100'}`}>
                                {error ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <div className="flex-1 text-sm font-medium pt-0.5">
                                {error || successMessage}
                            </div>
                            <button
                                onClick={() => {
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Layout */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                {/* Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">PhishGuard</h1>
                        <p className="text-slate-600 text-sm">Advanced Phishing Protection</p>
                    </motion.div>

                    {/* Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {showOTP
                                    ? 'Verify Your Email'
                                    : (isLogin ? 'Welcome back' : 'Create account')}
                            </h2>
                            <p className="text-slate-600 text-sm">
                                {showOTP
                                    ? `Enter the 6-digit code sent to ${emailForOTP}`
                                    : (isLogin ? 'Sign in to your account' : 'Get started with PhishGuard')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {showOTP ? (
                                <div className="space-y-4">
                                    <label className="text-slate-700 text-sm font-medium block">Verification Code</label>
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
                                                className="w-12 h-14 bg-slate-50 border border-slate-300 rounded-xl text-center text-slate-900 text-xl font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={loading}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors disabled:opacity-50"
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!isLogin && (
                                        <div className="space-y-2">
                                            <label className="text-slate-700 text-sm font-medium block">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-slate-700 text-sm font-medium block">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@company.com"
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-700 text-sm font-medium block">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>
                                        {showOTP
                                            ? 'Verify & Continue'
                                            : (isLogin ? 'Sign In' : 'Create Account')}
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        {!showOTP ? (
                            <div className="mt-6 text-center">
                                <p className="text-slate-600 text-sm">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                    <button
                                        onClick={() => navigate(isLogin ? '/signup' : '/login')}
                                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                                    >
                                        {isLogin ? 'Sign up' : 'Sign in'}
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
                                    className="text-slate-600 hover:text-slate-900 text-sm transition-colors font-medium"
                                >
                                    ← Back to {isLogin ? 'Login' : 'Signup'}
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Security Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200/50">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span className="text-slate-600 text-xs font-medium">
                                Secured with end-to-end encryption
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
