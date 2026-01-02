import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Shield, LogOut, Trash2, UploadCloud,
    AlertTriangle, CheckCircle, Loader2, Search,
    Lock, Phone, Info, ShieldAlert, XCircle, AlertOctagon,
    Mail, FileText, Target, TrendingUp, ArrowRight, Sparkles
} from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analyze');
    const [inputText, setInputText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [currentAnalysis, setCurrentAnalysis] = useState(null);

    // File upload states
    const [inputMode, setInputMode] = useState('text');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef(null);

    const getRecommendationIcon = (text) => {
        const cleanText = text.replace(/^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]/u, '').trim();

        if (text.startsWith('🚨') || text.includes('DO NOT')) {
            return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', text: cleanText };
        } else if (text.startsWith('⚠️') || text.includes('Suspicious')) {
            return { icon: AlertOctagon, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', text: cleanText };
        } else if (text.startsWith('🔐') || text.includes('password')) {
            return { icon: Lock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', text: cleanText };
        } else if (text.startsWith('📞') || text.includes('Verify')) {
            return { icon: Phone, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', text: cleanText };
        } else if (text.startsWith('✅') || text.includes('Enable')) {
            return { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', text: cleanText };
        } else if (text.startsWith('ℹ️')) {
            return { icon: Info, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', text: cleanText };
        } else {
            return { icon: ShieldAlert, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', text: cleanText };
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.eml')) {
            setSelectedFile(file);
            const text = await file.text();
            setInputText(text);
        } else {
            alert('Please select a valid .eml file');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.eml')) {
            setSelectedFile(file);
            const text = await file.text();
            setInputText(text);
        } else {
            alert('Please drop a valid .eml file');
        }
    };

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setAnalyzing(true);
        try {
            const response = await api.post('/analysis/analyze', { inputText });
            if (response.data.success) {
                setCurrentAnalysis(response.data.data);
                setActiveTab('results');
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };



    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getThreatColor = (threatLevel) => {
        const colors = {
            'Safe': 'text-emerald-600',
            'LowRisk': 'text-yellow-600',
            'MediumRisk': 'text-orange-600',
            'HighRisk': 'text-red-600',
            'Critical': 'text-red-700'
        };
        return colors[threatLevel] || 'text-slate-600';
    };

    const getThreatBg = (threatLevel) => {
        const colors = {
            'Safe': 'bg-emerald-50 border-emerald-200',
            'LowRisk': 'bg-yellow-50 border-yellow-200',
            'MediumRisk': 'bg-orange-50 border-orange-200',
            'HighRisk': 'bg-red-50 border-red-200',
            'Critical': 'bg-red-100 border-red-300'
        };
        return colors[threatLevel] || 'bg-slate-50 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">PhishGuard</h1>
                                <p className="text-xs text-slate-600">AI-Powered Protection</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-600">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8">
                    {[
                        { id: 'analyze', label: 'Analyze', icon: Sparkles },
                        { id: 'results', label: 'Results', icon: FileText }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all border ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-600'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {/* Analyze Tab */}
                    {activeTab === 'analyze' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-8 pb-6 border-b border-slate-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-6 h-6 text-indigo-600" />
                                            Analyze Content
                                        </h2>
                                        <p className="text-slate-600">
                                            Detect phishing in emails, URLs, or text
                                        </p>
                                    </div>

                                    {/* Toggle */}
                                    <div className="bg-slate-100 p-1 rounded-xl flex self-start md:self-auto">
                                        <button
                                            onClick={() => setInputMode('text')}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${inputMode === 'text'
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Paste Text
                                        </button>
                                        <button
                                            onClick={() => setInputMode('file')}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${inputMode === 'file'
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                        >
                                            <UploadCloud className="w-4 h-4" />
                                            Upload File
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-8">
                                {inputMode === 'text' ? (
                                    <div className="relative">
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Paste your suspicious email content, URL, or text here..."
                                            className="w-full h-64 p-5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-all font-mono text-sm leading-relaxed"
                                        />
                                        <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none">
                                            Supports URLs, Email Headers & Body
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragActive
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".eml"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        <div className="h-full flex flex-col items-center justify-center p-6">
                                            {selectedFile ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
                                                >
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                                        <Mail className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-900 font-semibold truncate">{selectedFile.name}</p>
                                                        <p className="text-slate-500 text-xs">
                                                            {(selectedFile.size / 1024).toFixed(2)} KB • .EML File
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                            setInputText('');
                                                        }}
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200">
                                                        <UploadCloud className="w-8 h-8 text-indigo-600" />
                                                    </div>
                                                    <p className="text-slate-900 font-semibold text-lg mb-1">
                                                        Drop your .EML file here
                                                    </p>
                                                    <p className="text-slate-500 text-sm">
                                                        or click to browse
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="p-8 pt-4 bg-slate-50 border-t border-slate-100">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={(!inputText.trim() && !selectedFile) || analyzing}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:transform-none"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            <span>Start Analysis</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {currentAnalysis ? (
                                <>
                                    {/* Header */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <h2 className="text-base font-bold text-slate-900 mb-1">Analysis Report</h2>
                                                <p className="text-slate-600 text-xs">
                                                    {new Date(currentAnalysis.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Risk Score */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                    <Target className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <span className="text-slate-700 text-xs font-semibold">Risk Score</span>
                                            </div>
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-2xl font-bold text-slate-900">{currentAnalysis.riskScore}</span>
                                                <span className="text-slate-500 text-xs">/ 100</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${currentAnalysis.riskScore}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Threat Level */}
                                        <div className={`rounded-xl border shadow-md p-4 ${getThreatBg(currentAnalysis.threatLevel)}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getThreatBg(currentAnalysis.threatLevel)}`}>
                                                    <ShieldAlert className={`w-4 h-4 ${getThreatColor(currentAnalysis.threatLevel)}`} />
                                                </div>
                                                <span className="text-slate-700 text-xs font-semibold">Threat Level</span>
                                            </div>
                                            <span className={`text-lg font-bold ${getThreatColor(currentAnalysis.threatLevel)}`}>
                                                {currentAnalysis.threatLevel}
                                            </span>
                                        </div>

                                        {/* Threats Found */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <span className="text-slate-700 text-xs font-semibold">Issues Found</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-slate-900">{currentAnalysis.detectedThreats?.length || 0}</span>
                                                <span className="text-slate-500 text-xs">
                                                    {currentAnalysis.detectedThreats?.length === 1 ? 'threat' : 'threats'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detected Threats */}
                                    {currentAnalysis.detectedThreats && currentAnalysis.detectedThreats.length > 0 && (
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                                            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                                    Detected Threats
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="space-y-2">
                                                    {currentAnalysis.detectedThreats.map((threat, index) => {
                                                        const getSeverityColor = (severity) => {
                                                            const colors = {
                                                                'critical': { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
                                                                'high': { badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
                                                                'medium': { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
                                                                'low': { badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' }
                                                            };
                                                            return colors[severity?.toLowerCase()] || colors.medium;
                                                        };

                                                        const severityStyle = getSeverityColor(threat.severity);

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-slate-300 hover:shadow-sm transition-all"
                                                            >
                                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 rounded-full ${severityStyle.dot}`} />
                                                                        <h4 className="font-semibold text-slate-900 text-sm">{threat.type}</h4>
                                                                    </div>
                                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${severityStyle.badge}`}>
                                                                        {threat.severity}
                                                                    </span>
                                                                </div>
                                                                <p className="text-slate-600 text-xs leading-relaxed mb-2 ml-4">
                                                                    {threat.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 ml-4">
                                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                        <Target className="w-3 h-3" />
                                                                        {threat.count} {threat.count === 1 ? 'occurrence' : 'occurrences'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                                            <div className="bg-indigo-600 px-5 py-3">
                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                    <Shield className="w-4 h-4" />
                                                    Security Recommendations
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {currentAnalysis.recommendations.map((rec, index) => {
                                                        const { icon: Icon, color, bgColor, borderColor, text } = getRecommendationIcon(rec);
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-md ${bgColor} ${borderColor} border flex items-center justify-center`}>
                                                                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                                                                    </div>
                                                                    <p className="text-slate-700 text-xs leading-relaxed pt-0.5">
                                                                        {text}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-12 text-center">
                                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600">No analysis results yet. Start by analyzing some content!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
