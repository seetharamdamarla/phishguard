import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Shield, LogOut, Mail, FileText, Download, Trash2, UploadCloud,
    AlertTriangle, CheckCircle, Loader2,
    Search, Filter, ChevronRight, XCircle, AlertOctagon,
    Lock, Phone, Info, ShieldAlert, ShieldCheck,
    TrendingUp, Target, Activity, Calendar, Clock
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
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'file'
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef(null);

    // Helper function to parse recommendation and get icon
    const getRecommendationIcon = (text) => {
        // Remove emoji and get clean text
        const cleanText = text.replace(/^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]/u, '').trim();

        if (text.startsWith('🚨') || text.includes('DO NOT')) {
            return {
                icon: XCircle,
                color: 'text-red-400',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/30',
                text: cleanText
            };
        } else if (text.startsWith('⚠️') || text.includes('Suspicious')) {
            return {
                icon: AlertOctagon,
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/30',
                text: cleanText
            };
        } else if (text.startsWith('🔐') || text.includes('password') || text.includes('credentials')) {
            return {
                icon: Lock,
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/10',
                borderColor: 'border-yellow-500/30',
                text: cleanText
            };
        } else if (text.startsWith('📞') || text.includes('Verify') || text.includes('contact')) {
            return {
                icon: Phone,
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                text: cleanText
            };
        } else if (text.startsWith('✅') || text.includes('Enable') || text.includes('Report') || text.includes('Keep')) {
            return {
                icon: CheckCircle,
                color: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30',
                text: cleanText
            };
        } else if (text.startsWith('ℹ️')) {
            return {
                icon: Info,
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-500/10',
                borderColor: 'border-cyan-500/30',
                text: cleanText
            };
        } else {
            return {
                icon: ShieldAlert,
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                text: cleanText
            };
        }
    };

    // File upload handlers
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.eml')) {
            setSelectedFile(file);
            // Read file content
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
            // Read file content
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

    const handleDownload = async (analysisId) => {
        try {
            console.log('Downloading report for analysis:', analysisId);
            console.log('Analysis ID type:', typeof analysisId);

            if (!analysisId) {
                alert('Error: Analysis ID is missing. Please try analyzing the content again.');
                return;
            }

            const response = await api.get(`/analysis/${analysisId}/download`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `phishguard-report-${analysisId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log('Report downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            console.error('Error response:', error.response);

            let errorMessage = 'Failed to download report.\n\n';

            // Try to read the blob as text to get the actual error message
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const jsonError = JSON.parse(text);
                    errorMessage += `Server says: ${jsonError.message}\n`;
                    errorMessage += `Status: ${error.response.status}`;
                } catch (e) {
                    errorMessage += `Status: ${error.response?.status}\n`;
                    errorMessage += `Please check the browser console for details.`;
                }
            } else if (error.response?.status === 404) {
                errorMessage += 'Analysis not found.';
            } else if (error.response?.status === 403) {
                errorMessage += 'You do not have permission to access this report.';
            } else if (error.response?.status === 500) {
                errorMessage += 'Server error while generating the report.';
            } else {
                errorMessage += 'Please try again later.';
            }

            alert(errorMessage);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getThreatColor = (threatLevel) => {
        const colors = {
            'Safe': 'text-green-500',
            'Low Risk': 'text-yellow-500',
            'Medium Risk': 'text-orange-500',
            'High Risk': 'text-red-500',
            'Critical': 'text-red-700'
        };
        return colors[threatLevel] || 'text-gray-500';
    };

    const getThreatBg = (threatLevel) => {
        const colors = {
            'Safe': 'bg-green-500/20 border-green-500/50',
            'Low Risk': 'bg-yellow-500/20 border-yellow-500/50',
            'Medium Risk': 'bg-orange-500/20 border-orange-500/50',
            'High Risk': 'bg-red-500/20 border-red-500/50',
            'Critical': 'bg-red-700/20 border-red-700/50'
        };
        return colors[threatLevel] || 'bg-gray-500/20 border-gray-500/50';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">PhishGuard</h1>
                                <p className="text-xs text-blue-200">Advanced Detection</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-blue-200">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
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
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'analyze', label: 'Analyze', icon: Search },
                        { id: 'results', label: 'Results', icon: FileText }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/15'
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
                    {/* Analyze Tab */}
                    {activeTab === 'analyze' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            {/* Header & Toggle */}
                            <div className="p-8 pb-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            <Search className="w-6 h-6 text-blue-400" />
                                            Analyze Content
                                        </h2>
                                        <p className="text-blue-200/60">
                                            Detect phishing in emails, URLs, or text snippets
                                        </p>
                                    </div>

                                    {/* Premium Toggle */}
                                    <div className="bg-black/20 p-1 rounded-xl flex self-start md:self-auto border border-white/5">
                                        <button
                                            onClick={() => setInputMode('text')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${inputMode === 'text'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Paste Text
                                        </button>
                                        <button
                                            onClick={() => setInputMode('file')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${inputMode === 'file'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <UploadCloud className="w-4 h-4" />
                                            Upload File
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Input Area */}
                            <div className="p-8 pt-0">
                                {inputMode === 'text' ? (
                                    <div className="relative group">
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Paste the suspicious content here..."
                                            className="w-full h-64 p-6 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all font-mono text-sm leading-relaxed"
                                        />
                                        <div className="absolute bottom-4 right-4 text-xs text-white/20 pointer-events-none">
                                            Accepts URLs, Email Headers, Body Text
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all relative overflow-hidden group ${dragActive
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".eml"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        {/* Background Grid Pattern */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                                        </div>

                                        <div className="h-full flex flex-col items-center justify-center p-6 relative z-10">
                                            {selectedFile ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full max-w-sm bg-gray-900/50 border border-white/10 rounded-xl p-4 flex items-center gap-4 group-hover:border-white/20 transition-colors"
                                                >
                                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                                                        <Mail className="w-6 h-6 text-blue-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-medium truncate">{selectedFile.name}</p>
                                                        <p className="text-blue-300/60 text-xs">
                                                            {(selectedFile.size / 1024).toFixed(2)} KB • .EML File
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                            setInputText('');
                                                        }}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                                                        title="Remove File"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-xl shadow-blue-500/10">
                                                        <UploadCloud className="w-8 h-8 text-blue-400" />
                                                    </div>
                                                    <p className="text-white font-medium text-lg mb-1">
                                                        Drop your .EML file here
                                                    </p>
                                                    <p className="text-white/40 text-sm">
                                                        or click anywhere to browse
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="p-8 pt-4 bg-black/10 border-t border-white/5 flex gap-4">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={(!inputText.trim() && !selectedFile) || analyzing}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Running Analysis...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            <span>Analyze Content</span>
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
                                    {/* Clean Header Section */}
                                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-6">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1">Analysis Report</h2>
                                                <p className="text-white/60 text-sm">
                                                    {new Date(currentAnalysis.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDownload(currentAnalysis.id || currentAnalysis._id)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Download PDF</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {/* Risk Score */}
                                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                    <Target className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-white/70 text-sm font-medium">Risk Score</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-white">{currentAnalysis.riskScore}</span>
                                                <span className="text-white/50 text-sm">/ 100</span>
                                            </div>
                                            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${currentAnalysis.riskScore}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Threat Level */}
                                        <div className={`backdrop-blur-xl rounded-2xl border p-5 ${getThreatBg(currentAnalysis.threatLevel)}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-8 h-8 ${getThreatBg(currentAnalysis.threatLevel)} rounded-lg flex items-center justify-center border ${getThreatBg(currentAnalysis.threatLevel).split(' ')[1]}`}>
                                                    <ShieldAlert className={`w-4 h-4 ${getThreatColor(currentAnalysis.threatLevel)}`} />
                                                </div>
                                                <span className="text-white/70 text-sm font-medium">Threat Level</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${getThreatColor(currentAnalysis.threatLevel)}`}>
                                                    {currentAnalysis.threatLevel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Threats Detected */}
                                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                                </div>
                                                <span className="text-white/70 text-sm font-medium">Issues Found</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-white">{currentAnalysis.detectedThreats?.length || 0}</span>
                                                <span className="text-white/50 text-sm">
                                                    {currentAnalysis.detectedThreats?.length === 1 ? 'threat' : 'threats'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detected Threats */}
                                    {currentAnalysis.detectedThreats && currentAnalysis.detectedThreats.length > 0 && (
                                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Detected Threats</h3>

                                            <div className="space-y-3">
                                                {currentAnalysis.detectedThreats.map((threat, index) => {
                                                    const getSeverityColor = (severity) => {
                                                        const colors = {
                                                            'critical': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
                                                            'high': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
                                                            'medium': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
                                                            'low': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' }
                                                        };
                                                        return colors[severity?.toLowerCase()] || colors.medium;
                                                    };

                                                    const severityStyle = getSeverityColor(threat.severity);

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`bg-white/5 rounded-xl p-4 border ${severityStyle.border} hover:bg-white/10 transition-colors`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`flex-shrink-0 w-10 h-10 ${severityStyle.bg} rounded-lg flex items-center justify-center border ${severityStyle.border}`}>
                                                                    <AlertTriangle className={`w-5 h-5 ${severityStyle.text}`} />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-3 mb-1">
                                                                        <h4 className="font-semibold text-white">{threat.type}</h4>
                                                                        <span className={`flex-shrink-0 px-2 py-0.5 ${severityStyle.bg} rounded ${severityStyle.text} text-xs font-medium uppercase border ${severityStyle.border}`}>
                                                                            {threat.severity}
                                                                        </span>
                                                                    </div>

                                                                    <p className="text-white/70 text-sm mb-2">
                                                                        {threat.description}
                                                                    </p>

                                                                    <div className="flex items-center gap-3 text-xs text-white/50">
                                                                        <span>Found: {threat.count} {threat.count === 1 ? 'time' : 'times'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
                                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-blue-400" />
                                                Security Recommendations
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {currentAnalysis.recommendations.map((rec, index) => {
                                                    const { icon: Icon, color, bgColor, borderColor, text } = getRecommendationIcon(rec);
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor} ${borderColor} bg-opacity-30 backdrop-blur-sm transition-colors hover:bg-opacity-40`}
                                                        >
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${bgColor} ${borderColor} border flex items-center justify-center`}>
                                                                <Icon className={`w-4 h-4 ${color}`} />
                                                            </div>
                                                            <p className="text-white/90 text-sm leading-relaxed py-1">{text}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-12 text-center">
                                    <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                    <p className="text-white/70">No analysis results yet. Start by analyzing some content!</p>
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
