import React from 'react';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TextAnalysisInput = ({ 
  inputText, 
  onInputChange, 
  onAnalyze, 
  onClear, 
  isAnalyzing, 
  hasContent 
}) => {
  const handlePaste = (e) => {
    // Allow default paste behavior, then trigger analysis
    setTimeout(() => {
      onAnalyze();
    }, 100);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Shield" size={20} className="mr-2 text-primary" />
          Phishing Analysis Tool
        </h2>
        <div className="flex space-x-2">
          {hasContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              iconName="RotateCcw"
              disabled={isAnalyzing}
            >
              Clear
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={onAnalyze}
            iconName="Search"
            loading={isAnalyzing}
            disabled={!hasContent}
          >
            Analyze
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Paste Suspicious Content
          </label>
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e?.target?.value)}
            onPaste={handlePaste}
            placeholder="Paste email content, subject lines, messages, or URLs here for analysis. The tool will automatically detect suspicious patterns and provide a comprehensive security assessment..."
            className="w-full h-32 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            disabled={isAnalyzing}
          />
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="mr-1" />
          <span>
            Supports email content, URLs, and text messages. Analysis is performed locally for privacy.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextAnalysisInput;