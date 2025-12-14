/**
 * Temporary debug endpoint to check analysis data structure
 */
export const debugAnalysis = async (req, res) => {
    try {
        console.log('Debug request for analysis ID:', req.params.id);

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
                message: 'Analysis not found',
                requestedId: req.params.id
            });
        }

        // Return the full analysis structure for debugging
        res.status(200).json({
            success: true,
            data: analysis,
            dataTypes: {
                detectedThreats: typeof analysis.detectedThreats,
                isArray: Array.isArray(analysis.detectedThreats),
                length: analysis.detectedThreats?.length
            }
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
};
