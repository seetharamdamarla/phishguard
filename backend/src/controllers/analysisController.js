import prisma from '../utils/prisma.js';
import { incrementAnalysisCount, findUserById } from '../utils/userHelpers.js';
import phishingDetectionService from '../services/phishingDetection.js';
import pdfService from '../services/pdfService.js';

/**
 * @desc    Analyze text for phishing
 * @route   POST /api/analysis/analyze
 * @access  Private
 */
export const analyzeText = async (req, res) => {
    try {
        const { inputText } = req.body;

        if (!inputText || inputText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide text to analyze'
            });
        }

        // Perform analysis
        const analysisResults = await phishingDetectionService.analyzeText(inputText);

        // Save analysis to database with relational structure
        const analysis = await prisma.analysis.create({
            data: {
                userId: req.user.id,
                inputText,
                riskScore: analysisResults.riskScore,
                threatLevel: analysisResults.threatLevel,
                recommendations: analysisResults.recommendations,
                // Create related records
                detectedThreats: {
                    create: analysisResults.detectedThreats.map(threat => ({
                        type: threat.type,
                        description: threat.description,
                        severity: threat.severity,
                        count: threat.count,
                        keywords: threat.keywords
                    }))
                },
                suspiciousElements: {
                    create: analysisResults.suspiciousElements.map(element => ({
                        text: element.text,
                        startIndex: element.startIndex,
                        endIndex: element.endIndex,
                        type: element.type,
                        riskLevel: element.riskLevel,
                        explanation: element.explanation,
                        recommendation: element.recommendation
                    }))
                },
                urlAnalysis: {
                    create: analysisResults.urlAnalysis.map(url => ({
                        url: url.url,
                        domain: url.domain,
                        status: url.status,
                        issues: url.issues,
                        riskScore: url.riskScore
                    }))
                },
                phishingTactics: {
                    create: analysisResults.phishingTactics.map(tactic => ({
                        name: tactic.name,
                        description: tactic.description,
                        confidence: tactic.confidence
                    }))
                },
                metadata: analysisResults.metadata ? {
                    create: {
                        analysisTime: analysisResults.metadata.analysisTime,
                        version: analysisResults.metadata.version,
                        detectionEngine: analysisResults.metadata.detectionEngine
                    }
                } : undefined
            },
            include: {
                detectedThreats: true,
                suspiciousElements: true,
                urlAnalysis: true,
                phishingTactics: true,
                metadata: true
            }
        });

        // Update user's analysis count
        await incrementAnalysisCount(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Analysis completed successfully',
            data: analysis
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during analysis'
        });
    }
};

/**
 * @desc    Get user's analysis history
 * @route   GET /api/analysis/history
 * @access  Private
 */
export const getAnalysisHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const analyses = await prisma.analysis.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
            select: {
                id: true,
                userId: true,
                riskScore: true,
                threatLevel: true,
                createdAt: true,
                updatedAt: true,
                inputText: false, // Exclude full text for list view
            }
        });

        const total = await prisma.analysis.count({
            where: { userId: req.user.id }
        });

        res.status(200).json({
            success: true,
            data: {
                analyses,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching history'
        });
    }
};

/**
 * @desc    Get single analysis by ID
 * @route   GET /api/analysis/:id
 * @access  Private
 */
export const getAnalysisById = async (req, res) => {
    try {
        const analysis = await prisma.analysis.findUnique({
            where: { id: req.params.id },
            include: {
                detectedThreats: true,
                suspiciousElements: true,
                urlAnalysis: true,
                phishingTactics: true,
                metadata: true
            }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Check if analysis belongs to user
        if (analysis.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this analysis'
            });
        }

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analysis'
        });
    }
};

/**
 * @desc    Download analysis report as PDF
 * @route   GET /api/analysis/:id/download
 * @access  Private
 */
export const downloadReport = async (req, res) => {
    try {
        console.log('Download request for analysis ID:', req.params.id);

        const analysis = await prisma.analysis.findUnique({
            where: { id: req.params.id },
            include: {
                detectedThreats: true,
                suspiciousElements: true,
                urlAnalysis: true,
                phishingTactics: true,
                metadata: true
            }
        });

        if (!analysis) {
            console.log('Analysis not found for ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        console.log('Analysis found, checking authorization...');

        // Check if analysis belongs to user
        if (analysis.userId !== req.user.id) {
            console.log('Authorization failed. Analysis userId:', analysis.userId, 'User id:', req.user.id);
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this analysis'
            });
        }

        console.log('Authorization successful, fetching user data...');

        // Get user data
        const user = await findUserById(req.user.id);

        console.log('Generating PDF report...');

        // Generate PDF
        const pdfBuffer = await pdfService.generateReport(
            analysis,
            {
                name: user.name,
                email: user.email
            }
        );

        console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=phishguard-report-${analysis.id}.pdf`
        );
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Download report error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while generating report'
        });
    }
};

/**
 * @desc    Delete analysis
 * @route   DELETE /api/analysis/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res) => {
    try {
        const analysis = await prisma.analysis.findUnique({
            where: { id: req.params.id }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Check if analysis belongs to user
        if (analysis.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this analysis'
            });
        }

        await prisma.analysis.delete({
            where: { id: req.params.id }
        });

        // Decrement user's analysis count
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                analysisCount: {
                    decrement: 1
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Analysis deleted successfully'
        });
    } catch (error) {
        console.error('Delete analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting analysis'
        });
    }
};

/**
 * @desc    Get analysis statistics
 * @route   GET /api/analysis/stats
 * @access  Private
 */
export const getAnalysisStats = async (req, res) => {
    try {
        const analyses = await prisma.analysis.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        const stats = {
            totalAnalyses: analyses.length,
            averageRiskScore: 0,
            threatLevelDistribution: {
                Safe: 0,
                LowRisk: 0,
                MediumRisk: 0,
                HighRisk: 0,
                Critical: 0
            },
            recentAnalyses: analyses.slice(0, 5).map(a => ({
                id: a.id,
                riskScore: a.riskScore,
                threatLevel: a.threatLevel,
                createdAt: a.createdAt
            }))
        };

        if (analyses.length > 0) {
            stats.averageRiskScore = Math.round(
                analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length
            );

            analyses.forEach(a => {
                stats.threatLevelDistribution[a.threatLevel]++;
            });
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};
