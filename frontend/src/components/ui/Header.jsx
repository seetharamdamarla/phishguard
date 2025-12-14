import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ brandConfig = {}, utilityActions = [] }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const defaultBrandConfig = {
    name: 'PhishGuard',
    logo: null,
    clickable: true,
    ...brandConfig
  };

  const defaultUtilityActions = [
    {
      label: 'Help',
      action: 'modal',
      icon: 'HelpCircle',
      onClick: () => setIsHelpModalOpen(true)
    },
    ...utilityActions
  ];

  const handleBrandClick = () => {
    if (defaultBrandConfig?.clickable) {
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Brand Section */}
          <div 
            className={`flex items-center space-x-3 ${defaultBrandConfig?.clickable ? 'cursor-pointer' : ''}`}
            onClick={handleBrandClick}
          >
            {defaultBrandConfig?.logo ? (
              <img 
                src={defaultBrandConfig?.logo} 
                alt={`${defaultBrandConfig?.name} logo`}
                className="h-8 w-auto"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Shield" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  {defaultBrandConfig?.name}
                </span>
              </div>
            )}
          </div>

          {/* Utility Actions */}
          <div className="flex items-center space-x-2">
            {defaultUtilityActions?.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action?.onClick}
                iconName={action?.icon}
                className="text-muted-foreground hover:text-foreground"
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </header>
      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Help & Support</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHelpModalOpen(false)}
                iconName="X"
              />
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                PhishGuard helps you identify potentially dangerous phishing attempts in emails, 
                messages, and websites. Simply paste the suspicious content into the analysis tool 
                to receive an instant security assessment.
              </p>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">How to use:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Copy and paste suspicious email content or URLs</li>
                  <li>Review the risk score and highlighted suspicious elements</li>
                  <li>Click on highlighted text for detailed explanations</li>
                  <li>Follow the recommended security actions</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs">
                  For additional support, contact our security team at support@phishguard.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;