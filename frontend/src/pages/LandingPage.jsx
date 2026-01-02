import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Target, Lock, TrendingUp, ArrowRight, Check, Sparkles, Mail, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Detection',
            description: 'Advanced machine learning algorithms analyze emails and URLs in real-time to detect sophisticated phishing attempts.'
        },
        {
            icon: Zap,
            title: 'Instant Analysis',
            description: 'Get comprehensive security reports in seconds with detailed threat scoring and risk assessment.'
        },
        {
            icon: Target,
            title: 'Precision Accuracy',
            description: 'Our NLP engine identifies subtle phishing tactics that traditional filters miss, protecting you better.'
        },
        {
            icon: Lock,
            title: 'Enterprise Security',
            description: 'Bank-grade encryption and compliance with industry standards ensure your data stays protected.'
        }
    ];

    const stats = [
        { number: '99.9%', label: 'Detection Rate' },
        { number: '<1s', label: 'Analysis Time' },
        { number: '500K+', label: 'Threats Blocked' },
        { number: '24/7', label: 'Protection' }
    ];

    const steps = [
        { number: '01', title: 'Paste or Upload', description: 'Copy suspicious email content or upload .EML files directly' },
        { number: '02', title: 'AI Analyzes', description: 'Our advanced algorithms scan for phishing indicators and threats' },
        { number: '03', title: 'Get Results', description: 'Receive detailed report with risk score and recommendations' }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">PhishGuard</span>
                        </div>

                        <button
                            onClick={() => navigate('/signup')}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
                    />
                </div>

                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                >
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-600">AI-Powered Phishing Detection</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight"
                        >
                            Stop Phishing Attacks
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Before They Start
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
                        >
                            PhishGuard uses advanced AI to analyze emails and URLs in real-time, protecting you from sophisticated phishing attempts with unmatched accuracy.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/60 transform hover:-translate-y-1"
                            >
                                Start Protecting Now
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl transition-all border border-slate-200 shadow-lg hover:shadow-xl"
                            >
                                Sign In
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Why Choose PhishGuard?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Advanced technology meets simplicity for unbeatable protection
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Protection in three simple steps
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-indigo-500/30">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600">
                                        {step.description}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 -translate-x-1/2" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600" />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Stay Protected?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                            Join thousands of users who trust PhishGuard to keep them safe from phishing attacks.
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-xl transition-all shadow-2xl hover:shadow-white/30 transform hover:-translate-y-1 mx-auto"
                        >
                            Get Started for Free
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">PhishGuard</span>
                        </div>
                        <p className="text-slate-600 text-sm">
                            © 2026 PhishGuard. Advanced AI Phishing Protection.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
