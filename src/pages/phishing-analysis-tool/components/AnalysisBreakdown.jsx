import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisBreakdown = ({ analysisData, isVisible }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  if (!isVisible || !analysisData) return null;

  const handleCopyResults = async () => {
    const resultsText = `PhishGuard Analysis Results
Risk Score: ${analysisData?.riskScore}%
Threat Level: ${analysisData?.threatLevel}

Detected Threats:
${analysisData?.detectedThreats?.map(threat => `• ${threat?.type}: ${threat?.description}`)?.join('\n')}

URL Analysis:
${analysisData?.urlAnalysis?.map(url => `• ${url?.domain} - ${url?.status}`)?.join('\n')}

Recommendations:
${analysisData?.recommendations?.map(rec => `• ${rec}`)?.join('\n')}

Analysis performed on ${new Date()?.toLocaleString()}`;

    try {
      await navigator.clipboard?.writeText(resultsText);
      setCopiedSection('all');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy results:', err);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
          Detailed Analysis
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyResults}
          iconName={copiedSection === 'all' ? 'Check' : 'Copy'}
          className={copiedSection === 'all' ? 'text-success border-success' : ''}
        >
          {copiedSection === 'all' ? 'Copied!' : 'Copy Results'}
        </Button>
      </div>
      <div className="space-y-6">
        {/* Detected Threats */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="AlertTriangle" size={16} className="mr-2 text-destructive" />
            Detected Threats ({analysisData?.detectedThreats?.length})
          </h4>
          <div className="space-y-3">
            {analysisData?.detectedThreats?.map((threat, index) => (
              <div key={index} className="bg-muted/30 rounded-md p-3 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-foreground">{threat?.type}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        threat?.severity === 'high' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                        threat?.severity === 'medium'? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'
                      }`}>
                        {threat?.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{threat?.description}</p>
                  </div>
                  <Icon 
                    name={threat?.severity === 'high' ? 'XCircle' : threat?.severity === 'medium' ? 'AlertCircle' : 'CheckCircle'} 
                    size={16} 
                    className={
                      threat?.severity === 'high' ? 'text-destructive' :
                      threat?.severity === 'medium' ? 'text-warning' : 'text-success'
                    } 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* URL Analysis */}
        {analysisData?.urlAnalysis?.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Link" size={16} className="mr-2 text-primary" />
              URL Analysis ({analysisData?.urlAnalysis?.length})
            </h4>
            <div className="space-y-3">
              {analysisData?.urlAnalysis?.map((url, index) => (
                <div key={index} className="bg-muted/30 rounded-md p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-foreground break-all">{url?.domain}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      url?.status === 'suspicious' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                      url?.status === 'questionable'? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'
                    }`}>
                      {url?.status}
                    </span>
                  </div>
                  {url?.issues?.length > 0 && (
                    <div className="space-y-1">
                      {url?.issues?.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-center text-xs text-muted-foreground">
                          <Icon name="Minus" size={12} className="mr-1" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phishing Tactics */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Target" size={16} className="mr-2 text-accent" />
            Identified Phishing Tactics
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {analysisData?.phishingTactics?.map((tactic, index) => (
              <div key={index} className="bg-muted/30 rounded-md p-3 border border-border">
                <div className="flex items-center mb-2">
                  <Icon name="Zap" size={14} className="mr-2 text-accent" />
                  <span className="font-medium text-foreground text-sm">{tactic?.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{tactic?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2 text-success" />
            Security Recommendations
          </h4>
          <div className="space-y-2">
            {analysisData?.recommendations?.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <Icon name="CheckCircle" size={16} className="mr-2 mt-0.5 text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisBreakdown;