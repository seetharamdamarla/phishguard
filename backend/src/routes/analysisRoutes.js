import express from 'express';
import {
    analyzeText,
    getAnalysisHistory,
    getAnalysisById,
    downloadReport,
    deleteAnalysis,
    getAnalysisStats
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/analyze', analyzeText);
router.get('/history', getAnalysisHistory);
router.get('/stats', getAnalysisStats);
router.get('/:id', getAnalysisById);
router.get('/:id/download', downloadReport);
router.delete('/:id', deleteAnalysis);

export default router;
