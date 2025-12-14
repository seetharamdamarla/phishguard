import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputText: {
        type: String,
        required: true
    },
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    threatLevel: {
        type: String,
        enum: ['Safe', 'Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
        required: true
    },
    detectedThreats: [{
        type: {
            type: String,
            required: true
        },
        description: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical']
        },
        count: Number,
        keywords: [String]
    }],
    suspiciousElements: [{
        text: String,
        startIndex: Number,
        endIndex: Number,
        type: String,
        riskLevel: String,
        explanation: String,
        recommendation: String
    }],
    urlAnalysis: [{
        url: String,
        domain: String,
        status: {
            type: String,
            enum: ['safe', 'questionable', 'suspicious', 'malicious']
        },
        issues: [String],
        riskScore: Number
    }],
    phishingTactics: [{
        name: String,
        description: String,
        confidence: Number
    }],
    recommendations: [String],
    metadata: {
        analysisTime: Number, // in milliseconds
        version: String,
        detectionEngine: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ threatLevel: 1 });
analysisSchema.index({ riskScore: -1 });

export default mongoose.model('Analysis', analysisSchema);
