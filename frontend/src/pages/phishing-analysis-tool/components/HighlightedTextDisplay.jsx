import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HighlightedTextDisplay = ({ originalText, suspiciousElements, isVisible }) => {
  const [selectedElement, setSelectedElement] = useState(null);

  if (!isVisible || !originalText) return null;

  const renderHighlightedText = () => {
    if (!suspiciousElements?.length) {
      return <span className="text-foreground">{originalText}</span>;
    }

    let highlightedText = originalText;
    let offset = 0;

    // Sort elements by position to avoid conflicts
    const sortedElements = [...suspiciousElements]?.sort((a, b) => a?.startIndex - b?.startIndex);

    sortedElements?.forEach((element, index) => {
      const startIndex = element?.startIndex + offset;
      const endIndex = element?.endIndex + offset;
      const elementId = `element-${index}`;
      
      const highlightClass = element?.riskLevel === 'high' ?'bg-destructive/20 text-destructive border-b-2 border-destructive/40 cursor-pointer hover:bg-destructive/30'
        : element?.riskLevel === 'medium' ?'bg-warning/20 text-warning border-b-2 border-warning/40 cursor-pointer hover:bg-warning/30' :'bg-success/20 text-success border-b-2 border-success/40 cursor-pointer hover:bg-success/30';

      const beforeText = highlightedText?.substring(0, startIndex);
      const highlightedPart = highlightedText?.substring(startIndex, endIndex);
      const afterText = highlightedText?.substring(endIndex);

      const wrappedHighlight = `<span class="${highlightClass}" data-element-id="${elementId}" onClick="handleElementClick('${elementId}')">${highlightedPart}</span>`;
      
      highlightedText = beforeText + wrappedHighlight + afterText;
      offset += wrappedHighlight?.length - highlightedPart?.length;
    });

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        onClick={(e) => {
          const elementId = e?.target?.getAttribute('data-element-id');
          if (elementId) {
            const elementIndex = parseInt(elementId?.split('-')?.[1]);
            setSelectedElement(suspiciousElements?.[elementIndex]);
          }
        }}
      />
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Analysis Results
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="MousePointer" size={14} className="mr-1" />
          <span>Click highlighted text for details</span>
        </div>
      </div>
      <div className="space-y-4">
        {/* Highlighted text display */}
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <div className="text-sm leading-relaxed">
            {renderHighlightedText()}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive/20 border border-destructive/40 rounded mr-2"></div>
            <span className="text-muted-foreground">High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning/20 border border-warning/40 rounded mr-2"></div>
            <span className="text-muted-foreground">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success/20 border border-success/40 rounded mr-2"></div>
            <span className="text-muted-foreground">Low Risk</span>
          </div>
        </div>

        {/* Element details tooltip */}
        {selectedElement && (
          <div className="bg-popover border border-border rounded-lg p-4 shadow-modal">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Threat Analysis</h4>
              <button
                onClick={() => setSelectedElement(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Detected Pattern:</span>
                <span className="ml-2 text-muted-foreground">{selectedElement?.type}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Risk Level:</span>
                <span className={`ml-2 capitalize ${
                  selectedElement?.riskLevel === 'high' ? 'text-destructive' :
                  selectedElement?.riskLevel === 'medium' ? 'text-warning' : 'text-success'
                }`}>
                  {selectedElement?.riskLevel}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">Explanation:</span>
                <p className="mt-1 text-muted-foreground">{selectedElement?.explanation}</p>
              </div>
              {selectedElement?.recommendation && (
                <div>
                  <span className="font-medium text-foreground">Recommendation:</span>
                  <p className="mt-1 text-muted-foreground">{selectedElement?.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightedTextDisplay;