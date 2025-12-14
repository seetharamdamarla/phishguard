import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskScoreDisplay = ({ riskScore, isVisible }) => {
  const getRiskLevel = (score) => {
    if (score <= 30) return { level: 'Safe', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20' };
    if (score <= 70) return { level: 'Medium Risk', color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' };
    return { level: 'High Risk', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/20' };
  };

  const getDialColor = (score) => {
    if (score <= 30) return '#059669'; // success
    if (score <= 70) return '#F59E0B'; // warning
    return '#DC2626'; // destructive
  };

  const risk = getRiskLevel(riskScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  if (!isVisible) return null;

  return (
    <div className={`bg-card rounded-lg border ${risk?.borderColor} p-6 shadow-card ${risk?.bgColor}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${risk?.color} ${risk?.bgColor} border ${risk?.borderColor}`}>
          {risk?.level}
        </div>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getDialColor(riskScore)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-risk-dial"
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${risk?.color}`}>
                {riskScore}%
              </div>
              <div className="text-xs text-muted-foreground">
                Risk Score
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Threat Level:</span>
          <span className={`font-medium ${risk?.color}`}>{risk?.level}</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Icon name="Clock" size={14} className="mr-1" />
          <span>Analysis completed at {new Date()?.toLocaleTimeString()}</span>
        </div>

        {riskScore > 50 && (
          <div className={`flex items-start p-3 rounded-md ${risk?.bgColor} border ${risk?.borderColor}`}>
            <Icon name="AlertTriangle" size={16} className={`mr-2 mt-0.5 ${risk?.color}`} />
            <div className="text-xs">
              <p className={`font-medium ${risk?.color} mb-1`}>Security Recommendation</p>
              <p className="text-muted-foreground">
                Do not click any links or download attachments. Verify sender through alternative communication methods.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskScoreDisplay;