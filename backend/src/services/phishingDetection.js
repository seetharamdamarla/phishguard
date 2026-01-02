import natural from 'natural';
import compromise from 'compromise';

class PhishingDetectionService {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.tfidf = new natural.TfIdf();

        // Enhanced suspicious patterns database
        this.suspiciousPatterns = {
            urgency: {
                keywords: [
                    'urgent', 'immediate', 'expires today', 'act now', 'limited time',
                    'hurry', 'deadline', 'expires soon', 'time sensitive', 'last chance',
                    'don\'t miss out', 'only today', 'final notice', 'respond immediately'
                ],
                riskLevel: 'high',
                type: 'Urgency Manipulation',
                weight: 25
            },
            threats: {
                keywords: [
                    'suspend', 'terminate', 'close account', 'legal action', 'penalty',
                    'frozen', 'locked', 'deactivated', 'blocked', 'restricted',
                    'unauthorized access', 'security breach', 'compromised'
                ],
                riskLevel: 'high',
                type: 'Threat Language',
                weight: 30
            },
            financial: {
                keywords: [
                    'refund', 'tax return', 'prize', 'lottery', 'inheritance',
                    'wire transfer', 'bitcoin', 'cryptocurrency', 'payment required',
                    'claim your money', 'cash prize', 'million dollars', 'unclaimed funds'
                ],
                riskLevel: 'medium',
                type: 'Financial Lure',
                weight: 20
            },
            credentials: {
                keywords: [
                    'verify account', 'update password', 'confirm identity',
                    'login credentials', 'security code', 'validate account',
                    'verify your identity', 'confirm your account', 'update billing',
                    'payment information', 'credit card', 'social security'
                ],
                riskLevel: 'high',
                type: 'Credential Harvesting',
                weight: 28
            },
            generic: {
                keywords: [
                    'click here', 'download now', 'free', 'congratulations',
                    'winner', 'selected', 'you\'ve been chosen', 'exclusive offer',
                    'limited offer', 'special promotion', 'act fast'
                ],
                riskLevel: 'medium',
                type: 'Generic Phishing',
                weight: 15
            },
            impersonation: {
                keywords: [
                    'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
                    'bank', 'irs', 'fedex', 'ups', 'dhl', 'netflix', 'spotify',
                    'government', 'tax office', 'customer support'
                ],
                riskLevel: 'high',
                type: 'Brand Impersonation',
                weight: 22
            }
        };

        // Malicious URL patterns
        this.maliciousUrlPatterns = [
            /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i, // URL shorteners
            /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
            /[a-z0-9-]+\.(tk|ml|ga|cf|gq)$/i, // Free domains
            /-secure|-verify|-account|-login|-update/i, // Suspicious subdomains
            /paypal|amazon|microsoft|apple|google/i // Brand typosquatting
        ];
    }

    /**
     * Main analysis function
     */
    async analyzeText(inputText) {
        const startTime = Date.now();

        if (!inputText || inputText.trim().length === 0) {
            throw new Error('Input text is required');
        }

        const text = inputText.toLowerCase();
        const foundElements = [];
        let totalRisk = 0;

        // 1. Pattern-based analysis
        const patternResults = this.analyzePatterns(inputText, text);
        foundElements.push(...patternResults.elements);
        totalRisk += patternResults.risk;

        // 2. URL analysis
        const urlResults = this.analyzeUrls(inputText);
        totalRisk += urlResults.risk;

        // 3. Linguistic analysis
        const linguisticResults = this.analyzeLinguistics(inputText);
        totalRisk += linguisticResults.risk;

        // 4. Sentiment analysis
        const sentimentResults = this.analyzeSentiment(inputText);
        totalRisk += sentimentResults.risk;

        // Cap risk score at 100
        const finalRiskScore = Math.min(totalRisk, 100);

        // Determine threat level
        const threatLevel = this.determineThreatLevel(finalRiskScore);

        // Generate detected threats summary
        const detectedThreats = this.generateThreatsSummary(foundElements);

        // Identify phishing tactics
        const phishingTactics = this.identifyPhishingTactics(
            finalRiskScore,
            foundElements,
            linguisticResults
        );

        // Generate recommendations
        const recommendations = this.generateRecommendations(
            finalRiskScore,
            detectedThreats,
            urlResults
        );

        const analysisTime = Date.now() - startTime;

        return {
            riskScore: finalRiskScore,
            threatLevel,
            detectedThreats,
            suspiciousElements: foundElements,
            urlAnalysis: urlResults.details,
            phishingTactics,
            recommendations,
            metadata: {
                analysisTime,
                version: '2.0',
                detectionEngine: 'PhishGuard Advanced ML'
            }
        };
    }

    /**
     * Analyze text for suspicious patterns
     */
    analyzePatterns(originalText, lowerText) {
        const elements = [];
        let risk = 0;

        Object.entries(this.suspiciousPatterns).forEach(([category, pattern]) => {
            pattern.keywords.forEach(keyword => {
                const regex = new RegExp(
                    `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
                    'gi'
                );
                let match;

                while ((match = regex.exec(originalText)) !== null) {
                    risk += pattern.weight;

                    elements.push({
                        text: match[0],
                        startIndex: match.index,
                        endIndex: match.index + match[0].length,
                        type: pattern.type,
                        riskLevel: pattern.riskLevel,
                        explanation: this.getExplanation(pattern.type, match[0]),
                        recommendation: this.getRecommendation(pattern.type)
                    });
                }
            });
        });

        return { elements, risk };
    }

    /**
     * Analyze URLs in the text
     */
    analyzeUrls(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const urls = text.match(urlRegex) || [];
        const details = [];
        let risk = 0;

        urls.forEach(url => {
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname;
                const issues = [];
                let status = 'safe';
                let urlRisk = 0;

                // Check for URL shorteners
                if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i.test(domain)) {
                    issues.push('Shortened URL - destination unclear');
                    status = 'questionable';
                    urlRisk += 15;
                }

                // Check for suspicious subdomain structure
                if (domain.split('.').length > 3) {
                    issues.push('Suspicious subdomain structure');
                    status = 'suspicious';
                    urlRisk += 18;
                }

                // Check for IP address instead of domain
                if (/\d+\.\d+\.\d+\.\d+/.test(domain)) {
                    issues.push('IP address instead of domain name');
                    status = 'suspicious';
                    urlRisk += 25;
                }

                // Check for free/suspicious TLDs
                if (/\.(tk|ml|ga|cf|gq)$/i.test(domain)) {
                    issues.push('Free or suspicious top-level domain');
                    status = 'suspicious';
                    urlRisk += 20;
                }

                // Check for brand impersonation in domain
                if (/-secure|-verify|-account|-login|-update/i.test(domain)) {
                    issues.push('Suspicious keywords in domain');
                    status = 'suspicious';
                    urlRisk += 22;
                }

                // Check for HTTPS
                if (urlObj.protocol === 'http:') {
                    issues.push('Insecure HTTP connection');
                    urlRisk += 10;
                }

                // Check for excessive hyphens
                if ((domain.match(/-/g) || []).length > 2) {
                    issues.push('Excessive hyphens in domain');
                    urlRisk += 12;
                }

                if (urlRisk > 30) status = 'malicious';
                else if (urlRisk > 15) status = 'suspicious';
                else if (urlRisk > 0) status = 'questionable';

                details.push({
                    url,
                    domain,
                    status,
                    issues,
                    riskScore: urlRisk
                });

                risk += urlRisk;
            } catch (error) {
                details.push({
                    url,
                    domain: 'Invalid URL',
                    status: 'malicious',
                    issues: ['Malformed URL structure'],
                    riskScore: 30
                });
                risk += 30;
            }
        });

        return { details, risk };
    }

    /**
     * Analyze linguistic patterns
     */
    analyzeLinguistics(text) {
        let risk = 0;
        const doc = compromise(text);

        // Check for excessive capitalization
        const sentences = text.split(/[.!?]+/);
        const capsRatio = sentences.filter(s =>
            s === s.toUpperCase() && s.length > 5
        ).length / Math.max(sentences.length, 1);

        if (capsRatio > 0.3) {
            risk += 15; // Excessive caps often indicate spam/phishing
        }

        // Check for poor grammar (simplified)
        const words = this.tokenizer.tokenize(text);
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        const vocabularyRichness = uniqueWords.size / Math.max(words.length, 1);

        if (vocabularyRichness < 0.3 && words.length > 20) {
            risk += 10; // Poor vocabulary diversity
        }

        // Check for excessive punctuation
        const punctuationCount = (text.match(/[!?]{2,}/g) || []).length;
        if (punctuationCount > 2) {
            risk += 8;
        }

        return { risk };
    }

    /**
     * Analyze sentiment (simplified)
     */
    analyzeSentiment(text) {
        let risk = 0;
        const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
        const tokens = this.tokenizer.tokenize(text.toLowerCase());
        const sentiment = analyzer.getSentiment(tokens);

        // Extremely negative sentiment often indicates threats
        if (sentiment < -0.5) {
            risk += 12;
        }

        return { risk };
    }

    /**
     * Determine threat level based on risk score
     */
    determineThreatLevel(riskScore) {
        if (riskScore >= 80) return 'Critical';
        if (riskScore >= 60) return 'High Risk';
        if (riskScore >= 40) return 'Medium Risk';
        if (riskScore >= 20) return 'Low Risk';
        return 'Safe';
    }

    /**
     * Generate threats summary
     */
    generateThreatsSummary(elements) {
        const threats = elements.reduce((acc, element) => {
            const existing = acc.find(threat => threat.type === element.type);
            if (existing) {
                existing.count++;
                if (!existing.keywords.includes(element.text)) {
                    existing.keywords.push(element.text);
                }
            } else {
                acc.push({
                    type: element.type,
                    description: element.explanation,
                    severity: element.riskLevel,
                    count: 1,
                    keywords: [element.text]
                });
            }
            return acc;
        }, []);

        return threats;
    }

    /**
     * Identify phishing tactics used
     */
    identifyPhishingTactics(riskScore, elements, linguisticResults) {
        const tactics = [];

        if (elements.some(e => e.type === 'Urgency Manipulation')) {
            tactics.push({
                name: 'Time Pressure',
                description: 'Creating artificial urgency to bypass critical thinking',
                confidence: 0.85
            });
        }

        if (elements.some(e => e.type === 'Threat Language')) {
            tactics.push({
                name: 'Fear Tactics',
                description: 'Using threats to intimidate and force compliance',
                confidence: 0.90
            });
        }

        if (elements.some(e => e.type === 'Brand Impersonation')) {
            tactics.push({
                name: 'Authority Impersonation',
                description: 'Pretending to be from trusted organizations',
                confidence: 0.88
            });
        }

        if (elements.some(e => e.type === 'Credential Harvesting')) {
            tactics.push({
                name: 'Credential Theft',
                description: 'Attempting to steal login credentials or personal data',
                confidence: 0.92
            });
        }

        if (elements.some(e => e.type === 'Financial Lure')) {
            tactics.push({
                name: 'Financial Manipulation',
                description: 'Using money as bait to lure victims',
                confidence: 0.80
            });
        }

        if (riskScore > 50) {
            tactics.push({
                name: 'Social Engineering',
                description: 'Manipulating emotions to bypass logical thinking',
                confidence: 0.75
            });
        }

        return tactics;
    }

    /**
     * Generate security recommendations
     */
    generateRecommendations(riskScore, threats, urlResults) {
        const recommendations = [];

        if (riskScore >= 60) {
            recommendations.push('🚨 DO NOT click any links or download attachments from this message');
            recommendations.push('🚨 DO NOT provide any personal information or credentials');
        }

        if (urlResults.details.some(u => u.status === 'suspicious' || u.status === 'malicious')) {
            recommendations.push('⚠️ Suspicious URLs detected - verify destinations before clicking');
        }

        if (threats.some(t => t.type === 'Credential Harvesting')) {
            recommendations.push('🔐 Never provide passwords or credentials through email links');
            recommendations.push('🔐 Visit websites directly by typing the URL in your browser');
        }

        if (threats.some(t => t.type === 'Threat Language')) {
            recommendations.push('📞 Verify sender identity through official contact methods');
        }

        // Always include one general recommendation
        if (riskScore >= 60) {
            recommendations.push('✅ Report this message to your IT security team immediately');
        } else if (riskScore >= 30) {
            recommendations.push('✅ Enable two-factor authentication on all accounts');
        } else {
            recommendations.push('ℹ️ While this message appears safe, always verify sender identity');
        }

        // Limit to maximum 6 recommendations for clean UI
        return recommendations.slice(0, 6);
    }

    /**
     * Get explanation for threat type
     */
    getExplanation(type, keyword) {
        const explanations = {
            'Urgency Manipulation': `The phrase "${keyword}" creates artificial time pressure, preventing critical thinking about the request.`,
            'Threat Language': `"${keyword}" is threatening language used to intimidate recipients into complying without verification.`,
            'Financial Lure': `"${keyword}" is a common financial incentive used to entice victims with promises of money or rewards.`,
            'Credential Harvesting': `"${keyword}" is typically used to trick users into providing login credentials or personal information.`,
            'Generic Phishing': `"${keyword}" is a common phrase used in phishing attempts to encourage immediate action.`,
            'Brand Impersonation': `"${keyword}" may indicate an attempt to impersonate a trusted brand or organization.`
        };
        return explanations[type] || 'This phrase is commonly associated with phishing attempts.';
    }

    /**
     * Get recommendation for threat type
     */
    getRecommendation(type) {
        const recommendations = {
            'Urgency Manipulation': 'Take time to verify urgent requests through official channels.',
            'Threat Language': 'Legitimate organizations rarely use threatening language.',
            'Financial Lure': 'Be skeptical of unexpected financial offers and verify through official sources.',
            'Credential Harvesting': 'Never provide credentials through email links. Visit websites directly.',
            'Generic Phishing': 'Verify sender and content through alternative communication methods.',
            'Brand Impersonation': 'Contact the organization directly using official contact information.'
        };
        return recommendations[type] || 'Exercise caution and verify the authenticity of this communication.';
    }
}

export default new PhishingDetectionService();
