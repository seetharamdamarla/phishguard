import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

class PDFService {
    /**
     * Generate a comprehensive phishing analysis report
     */
    async generateReport(analysisData, userData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const chunks = [];
                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Header with gradient effect (simulated with colors)
                this.addHeader(doc, analysisData);

                // Executive Summary
                this.addExecutiveSummary(doc, analysisData);

                // Risk Score Visualization
                this.addRiskScoreSection(doc, analysisData);

                // Detected Threats
                if (analysisData.detectedThreats && Array.isArray(analysisData.detectedThreats) && analysisData.detectedThreats.length > 0) {
                    this.addDetectedThreats(doc, analysisData);
                }

                // URL Analysis
                if (analysisData.urlAnalysis && Array.isArray(analysisData.urlAnalysis) && analysisData.urlAnalysis.length > 0) {
                    this.addUrlAnalysis(doc, analysisData);
                }

                // Phishing Tactics
                if (analysisData.phishingTactics && Array.isArray(analysisData.phishingTactics) && analysisData.phishingTactics.length > 0) {
                    this.addPhishingTactics(doc, analysisData);
                }

                // Analyzed Content
                this.addAnalyzedContent(doc, analysisData);

                // Recommendations
                if (analysisData.recommendations && Array.isArray(analysisData.recommendations) && analysisData.recommendations.length > 0) {
                    this.addRecommendations(doc, analysisData);
                }

                // Footer
                this.addFooter(doc, userData);

                doc.end();
            } catch (error) {
                console.error('PDF Generation Error:', error);
                reject(error);
            }
        });
    }

    addHeader(doc, analysisData) {
        // Logo and Title
        doc.fontSize(28)
            .fillColor('#667eea')
            .text('PhishGuard', 50, 50);

        doc.fontSize(12)
            .fillColor('#666')
            .text('Advanced Phishing Detection Report', 50, 85);

        // Date and Report ID
        const date = new Date(analysisData.createdAt || Date.now());
        doc.fontSize(10)
            .fillColor('#999')
            .text(`Generated: ${date.toLocaleString()}`, 50, 105)
            .text(`Report ID: ${analysisData.id || 'N/A'}`, 50, 120);

        // Horizontal line
        doc.moveTo(50, 145)
            .lineTo(545, 145)
            .strokeColor('#667eea')
            .lineWidth(2)
            .stroke();

        doc.moveDown(3);
    }

    addExecutiveSummary(doc, analysisData) {
        const currentY = doc.y;

        doc.fontSize(16)
            .fillColor('#333')
            .text('Executive Summary', 50, currentY);

        doc.moveDown(0.5);

        // Threat Level Box
        const threatColor = this.getThreatColor(analysisData.threatLevel);
        const boxY = doc.y;

        doc.rect(50, boxY, 495, 60)
            .fillAndStroke(threatColor, '#ddd');

        doc.fontSize(14)
            .fillColor('#fff')
            .text(`Threat Level: ${analysisData.threatLevel}`, 60, boxY + 10);

        doc.fontSize(24)
            .fillColor('#fff')
            .text(`Risk Score: ${analysisData.riskScore}/100`, 60, boxY + 30);

        doc.moveDown(4);
    }

    addRiskScoreSection(doc, analysisData) {
        doc.fontSize(16)
            .fillColor('#333')
            .text('Risk Assessment', 50, doc.y);

        doc.moveDown(0.5);

        // Risk score bar
        const barY = doc.y;
        const barWidth = 495;
        const fillWidth = (analysisData.riskScore / 100) * barWidth;

        // Background bar
        doc.rect(50, barY, barWidth, 30)
            .fillAndStroke('#f0f0f0', '#ddd');

        // Fill bar
        const fillColor = this.getRiskBarColor(analysisData.riskScore);
        doc.rect(50, barY, fillWidth, 30)
            .fill(fillColor);

        // Score text
        doc.fontSize(14)
            .fillColor('#333')
            .text(`${analysisData.riskScore}%`, 50 + fillWidth - 30, barY + 8);

        doc.moveDown(3);

        // Risk interpretation
        doc.fontSize(11)
            .fillColor('#666')
            .text(this.getRiskInterpretation(analysisData.riskScore), 50, doc.y, {
                width: 495,
                align: 'left'
            });

        doc.moveDown(2);
    }

    addDetectedThreats(doc, analysisData) {
        this.checkPageBreak(doc, 150);

        doc.fontSize(16)
            .fillColor('#333')
            .text('Detected Threats', 50, doc.y);

        doc.moveDown(0.5);

        analysisData.detectedThreats.forEach((threat, index) => {
            this.checkPageBreak(doc, 80);

            const boxY = doc.y;
            const severityColor = this.getSeverityColor(threat.severity || 'low');

            // Threat box
            doc.rect(50, boxY, 495, 70)
                .fillAndStroke('#f9f9f9', '#ddd');

            // Severity indicator
            doc.rect(50, boxY, 5, 70)
                .fill(severityColor);

            // Threat content
            doc.fontSize(12)
                .fillColor('#333')
                .text(`${index + 1}. ${threat.type || 'Unknown Threat'}`, 65, boxY + 10);

            const severityText = threat.severity ? threat.severity.toUpperCase() : 'UNKNOWN';
            const countText = threat.count || 0;
            doc.fontSize(10)
                .fillColor('#666')
                .text(`Severity: ${severityText} | Occurrences: ${countText}`, 65, boxY + 28);

            if (threat.keywords && threat.keywords.length > 0) {
                doc.fontSize(9)
                    .fillColor('#999')
                    .text(`Keywords: ${threat.keywords.slice(0, 5).join(', ')}${threat.keywords.length > 5 ? '...' : ''}`, 65, boxY + 45, {
                        width: 470
                    });
            }

            doc.moveDown(5);
        });

        doc.moveDown(1);
    }

    addUrlAnalysis(doc, analysisData) {
        this.checkPageBreak(doc, 150);

        doc.fontSize(16)
            .fillColor('#333')
            .text('URL Analysis', 50, doc.y);

        doc.moveDown(0.5);

        analysisData.urlAnalysis.forEach((urlData, index) => {
            this.checkPageBreak(doc, 100);

            const boxY = doc.y;
            const statusColor = this.getUrlStatusColor(urlData.status || 'safe');

            // URL box - removed 'auto' height, let it be determined by content
            doc.rect(50, boxY, 495, 65)
                .fillAndStroke('#f9f9f9', '#ddd');

            // Status indicator
            doc.circle(60, boxY + 15, 5)
                .fill(statusColor);

            // URL
            doc.fontSize(10)
                .fillColor('#333')
                .text(`${index + 1}. ${urlData.domain || urlData.url || 'Unknown URL'}`, 75, boxY + 10, { width: 460 });

            const statusText = urlData.status ? urlData.status.toUpperCase() : 'UNKNOWN';
            const riskText = urlData.riskScore || 0;
            doc.fontSize(9)
                .fillColor('#666')
                .text(`Status: ${statusText} | Risk: ${riskText}/100`, 75, boxY + 28);

            if (urlData.issues && urlData.issues.length > 0) {
                doc.fontSize(9)
                    .fillColor('#999')
                    .text(`Issues: ${urlData.issues.join(', ')}`, 75, boxY + 43, {
                        width: 460
                    });
            }

            doc.moveDown(4.5);
        });

        doc.moveDown(1);
    }

    addPhishingTactics(doc, analysisData) {
        this.checkPageBreak(doc, 150);

        doc.fontSize(16)
            .fillColor('#333')
            .text('Identified Phishing Tactics', 50, doc.y);

        doc.moveDown(0.5);

        analysisData.phishingTactics.forEach((tactic, index) => {
            this.checkPageBreak(doc, 70);

            const boxY = doc.y;

            doc.rect(50, boxY, 495, 60)
                .fillAndStroke('#fff5e6', '#ffcc80');

            doc.fontSize(11)
                .fillColor('#333')
                .text(`⚠️ ${tactic.name || 'Unknown Tactic'}`, 60, boxY + 10);

            doc.fontSize(9)
                .fillColor('#666')
                .text(tactic.description || 'No description available', 60, boxY + 28, { width: 470 });

            if (tactic.confidence) {
                doc.fontSize(9)
                    .fillColor('#999')
                    .text(`Confidence: ${(tactic.confidence * 100).toFixed(0)}%`, 60, boxY + 45);
            }

            doc.moveDown(4);
        });

        doc.moveDown(1);
    }

    addAnalyzedContent(doc, analysisData) {
        this.checkPageBreak(doc, 150);

        doc.fontSize(16)
            .fillColor('#333')
            .text('Analyzed Content', 50, doc.y);

        doc.moveDown(0.5);

        const inputText = analysisData.inputText || 'No content available';
        const contentPreview = inputText.substring(0, 500);
        const isTruncated = inputText.length > 500;

        doc.fontSize(9)
            .fillColor('#666')
            .text(contentPreview + (isTruncated ? '...' : ''), 50, doc.y, {
                width: 495,
                align: 'left'
            });

        if (isTruncated) {
            doc.fontSize(8)
                .fillColor('#999')
                .text(`(Content truncated - showing first 500 characters of ${inputText.length})`, 50, doc.y);
        }

        doc.moveDown(2);
    }

    addRecommendations(doc, analysisData) {
        this.checkPageBreak(doc, 200);

        doc.fontSize(16)
            .fillColor('#333')
            .text('Security Recommendations', 50, doc.y);

        doc.moveDown(0.5);

        if (analysisData.recommendations && analysisData.recommendations.length > 0) {
            analysisData.recommendations.forEach((recommendation, index) => {
                this.checkPageBreak(doc, 30);

                doc.fontSize(10)
                    .fillColor('#666')
                    .text(`${index + 1}. ${recommendation}`, 50, doc.y, {
                        width: 495,
                        indent: 15
                    });

                doc.moveDown(0.5);
            });
        }

        doc.moveDown(2);
    }

    addFooter(doc, userData) {
        const bottomY = 750;

        // Horizontal line
        doc.moveTo(50, bottomY)
            .lineTo(545, bottomY)
            .strokeColor('#ddd')
            .lineWidth(1)
            .stroke();

        doc.fontSize(8)
            .fillColor('#999')
            .text('This report was generated by PhishGuard Advanced Phishing Detection System', 50, bottomY + 10, {
                width: 495,
                align: 'center'
            });

        doc.text(`User: ${userData.name || 'N/A'} | ${userData.email || 'N/A'}`, 50, bottomY + 25, {
            width: 495,
            align: 'center'
        });

        doc.text('© 2024 PhishGuard. All rights reserved.', 50, bottomY + 40, {
            width: 495,
            align: 'center'
        });
    }

    // Helper methods
    checkPageBreak(doc, requiredSpace) {
        if (doc.y + requiredSpace > 750) {
            doc.addPage();
        }
    }

    getThreatColor(threatLevel) {
        const colors = {
            'Safe': '#4caf50',
            'Low Risk': '#8bc34a',
            'Medium Risk': '#ff9800',
            'High Risk': '#f44336',
            'Critical': '#b71c1c'
        };
        return colors[threatLevel] || '#999';
    }

    getRiskBarColor(riskScore) {
        if (riskScore >= 80) return '#b71c1c';
        if (riskScore >= 60) return '#f44336';
        if (riskScore >= 40) return '#ff9800';
        if (riskScore >= 20) return '#ffc107';
        return '#4caf50';
    }

    getSeverityColor(severity) {
        const colors = {
            'low': '#4caf50',
            'medium': '#ff9800',
            'high': '#f44336',
            'critical': '#b71c1c'
        };
        return colors[severity] || '#999';
    }

    getUrlStatusColor(status) {
        const colors = {
            'safe': '#4caf50',
            'questionable': '#ffc107',
            'suspicious': '#ff9800',
            'malicious': '#f44336'
        };
        return colors[status] || '#999';
    }

    getRiskInterpretation(riskScore) {
        if (riskScore >= 80) {
            return 'CRITICAL: This content exhibits multiple high-risk phishing indicators. Do not interact with any links, attachments, or requests. Report immediately to your security team.';
        } else if (riskScore >= 60) {
            return 'HIGH RISK: This content shows significant phishing characteristics. Exercise extreme caution and verify through official channels before taking any action.';
        } else if (riskScore >= 40) {
            return 'MEDIUM RISK: This content contains suspicious elements. Verify the sender\'s identity and legitimacy before responding or clicking any links.';
        } else if (riskScore >= 20) {
            return 'LOW RISK: While some minor concerns were detected, this content appears relatively safe. Still, verify sender identity as a best practice.';
        } else {
            return 'SAFE: No significant phishing indicators detected. However, always remain vigilant and verify unexpected requests.';
        }
    }
}

export default new PDFService();
