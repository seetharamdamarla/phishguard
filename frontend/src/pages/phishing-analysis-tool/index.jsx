import React, { useState, useCallback } from 'react';
import Header from '../../components/ui/Header';
import TextAnalysisInput from './components/TextAnalysisInput';
import RiskScoreDisplay from './components/RiskScoreDisplay';
import HighlightedTextDisplay from './components/HighlightedTextDisplay';
import AnalysisBreakdown from './components/AnalysisBreakdown';

const PhishingAnalysisTool = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [suspiciousElements, setSuspiciousElements] = useState([]);

  // Mock suspicious keywords and patterns database
  const suspiciousPatterns = {
    urgency: {
      keywords: ['urgent', 'immediate', 'expires today', 'act now', 'limited time', 'hurry', 'deadline'],
      riskLevel: 'high',
      type: 'Urgency Manipulation'
    },
    threats: {
      keywords: ['suspend', 'terminate', 'close account', 'legal action', 'penalty', 'frozen'],
      riskLevel: 'high',
      type: 'Threat Language'
    },
    financial: {
      keywords: ['refund', 'tax return', 'prize', 'lottery', 'inheritance', 'wire transfer', 'bitcoin'],
      riskLevel: 'medium',
      type: 'Financial Lure'
    },
    credentials: {
      keywords: ['verify account', 'update password', 'confirm identity', 'login credentials', 'security code'],
      riskLevel: 'high',
      type: 'Credential Harvesting'
    },
    generic: {
      keywords: ['click here', 'download now', 'free', 'congratulations', 'winner'],
      riskLevel: 'medium',
      type: 'Generic Phishing'
    }
  };

  const analyzeText = useCallback(() => {
    if (!inputText?.trim()) return;

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const foundElements = [];
      let totalRisk = 0;
      const text = inputText?.toLowerCase();

      // Analyze for suspicious patterns
      Object.entries(suspiciousPatterns)?.forEach(([category, pattern]) => {
        pattern?.keywords?.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          let match;
          
          while ((match = regex?.exec(inputText)) !== null) {
            const riskValue = pattern?.riskLevel === 'high' ? 25 : pattern?.riskLevel === 'medium' ? 15 : 10;
            totalRisk += riskValue;

            foundElements?.push({
              text: match?.[0],
              startIndex: match?.index,
              endIndex: match?.index + match?.[0]?.length,
              type: pattern?.type,
              riskLevel: pattern?.riskLevel,
              explanation: getExplanation(pattern?.type, match?.[0]),
              recommendation: getRecommendation(pattern?.type)
            });
          }
        });
      });

      // URL analysis
      const urlRegex = /(https?:\/\/[^\s]+)/gi;
      const urls = inputText?.match(urlRegex) || [];
      const urlAnalysis = urls?.map(url => {
        const domain = new URL(url)?.hostname;
        const issues = [];
        let status = 'safe';

        // Check for suspicious URL patterns
        if (domain?.includes('bit.ly') || domain?.includes('tinyurl') || domain?.includes('t.co')) {
          issues?.push('Shortened URL - destination unclear');
          status = 'questionable';
          totalRisk += 10;
        }

        if (domain?.split('.')?.length > 3) {
          issues?.push('Suspicious subdomain structure');
          status = 'suspicious';
          totalRisk += 15;
        }

        if (/\d+\.\d+\.\d+\.\d+/?.test(domain)) {
          issues?.push('IP address instead of domain name');
          status = 'suspicious';
          totalRisk += 20;
        }

        return { domain, status, issues };
      });

      // Cap risk score at 100
      const finalRiskScore = Math.min(totalRisk, 100);

      // Generate analysis breakdown
      const detectedThreats = foundElements?.reduce((acc, element) => {
        const existing = acc?.find(threat => threat?.type === element?.type);
        if (existing) {
          existing.count++;
        } else {
          acc?.push({
            type: element?.type,
            description: element?.explanation,
            severity: element?.riskLevel,
            count: 1
          });
        }
        return acc;
      }, []);

      const phishingTactics = [
        { name: 'Social Engineering', description: 'Manipulating emotions to bypass logical thinking' },
        { name: 'Urgency Creation', description: 'Creating false time pressure to force quick decisions' },
        { name: 'Authority Impersonation', description: 'Pretending to be from trusted organizations' },
        { name: 'Fear Tactics', description: 'Using threats to create panic and compliance' }
      ]?.filter((_, index) => index < Math.ceil(finalRiskScore / 25));

      const recommendations = [
        'Do not click any links or download attachments',
        'Verify sender identity through alternative communication methods',
        'Check URLs carefully before visiting any websites',
        'Report suspicious content to your IT security team',
        'Enable two-factor authentication on all accounts',
        'Keep software and security systems updated'
      ];

      setRiskScore(finalRiskScore);
      setSuspiciousElements(foundElements);
      setAnalysisResults({
        riskScore: finalRiskScore,
        threatLevel: finalRiskScore <= 30 ? 'Safe' : finalRiskScore <= 70 ? 'Medium Risk' : 'High Risk',
        detectedThreats,
        urlAnalysis,
        phishingTactics,
        recommendations: recommendations?.slice(0, Math.max(3, Math.ceil(finalRiskScore / 20)))
      });

      setIsAnalyzing(false);
    }, 2000);
  }, [inputText]);

  const getExplanation = (type, keyword) => {
    const explanations = {
      'Urgency Manipulation': `The phrase "${keyword}" is designed to create artificial time pressure, preventing you from thinking critically about the request.`,
      'Threat Language': `"${keyword}" is threatening language used to intimidate recipients into complying without verification.`,
      'Financial Lure': `"${keyword}" is a common financial incentive used in phishing to entice victims with promises of money or rewards.`,
      'Credential Harvesting': `"${keyword}" is typically used to trick users into providing login credentials or personal information.`,
      'Generic Phishing': `"${keyword}" is a common phrase used in phishing attempts to encourage immediate action without consideration.`
    };
    return explanations?.[type] || 'This phrase is commonly associated with phishing attempts.';
  };

  const getRecommendation = (type) => {
    const recommendations = {
      'Urgency Manipulation': 'Take time to verify the legitimacy of urgent requests through official channels.',
      'Threat Language': 'Legitimate organizations rarely use threatening language in communications.',
      'Financial Lure': 'Be skeptical of unexpected financial offers and verify through official sources.',
      'Credential Harvesting': 'Never provide credentials through email links. Visit websites directly.',
      'Generic Phishing': 'Verify the sender and content through alternative communication methods.'
    };
    return recommendations?.[type] || 'Exercise caution and verify the authenticity of this communication.';
  };

  const handleClear = () => {
    setInputText('');
    setAnalysisResults(null);
    setRiskScore(0);
    setSuspiciousElements([]);
  };

  const hasResults = analysisResults !== null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Phishing Analysis Tool
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Analyze suspicious emails, messages, and URLs to identify potential phishing attempts. 
              Get detailed explanations and security recommendations to protect yourself from cyber threats.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Input and Results */}
            <div className="lg:col-span-2 space-y-6">
              <TextAnalysisInput
                inputText={inputText}
                onInputChange={setInputText}
                onAnalyze={analyzeText}
                onClear={handleClear}
                isAnalyzing={isAnalyzing}
                hasContent={inputText?.trim()?.length > 0}
              />

              <HighlightedTextDisplay
                originalText={inputText}
                suspiciousElements={suspiciousElements}
                isVisible={hasResults}
              />

              <AnalysisBreakdown
                analysisData={analysisResults}
                isVisible={hasResults}
              />
            </div>

            {/* Right Column - Risk Score */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <RiskScoreDisplay
                  riskScore={riskScore}
                  isVisible={hasResults}
                />
              </div>
            </div>
          </div>

          {/* Educational Footer */}
          {!hasResults && (
            <div className="mt-12 bg-muted/30 rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                How PhishGuard Protects You
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Smart Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced pattern recognition identifies suspicious content and phishing tactics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Learn & Protect</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed explanations help you understand and recognize future threats
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Stay Secure</h4>
                  <p className="text-sm text-muted-foreground">
                    Get actionable recommendations to protect yourself and your data
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PhishingAnalysisTool;