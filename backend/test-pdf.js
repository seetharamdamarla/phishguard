import pdfService from './src/services/pdfService.js';

const testData = {
    id: 'test-123',
    createdAt: new Date(),
    riskScore: 75,
    threatLevel: 'High Risk',
    inputText: 'This is a test email content',
    detectedThreats: [{
        type: 'Urgency',
        severity: 'high',
        count: 2,
        keywords: ['urgent', 'immediately']
    }],
    urlAnalysis: [],
    phishingTactics: [],
    recommendations: ['Do not click any links', 'Verify sender identity']
};

const userData = {
    name: 'Test User',
    email: 'test@example.com'
};

console.log('Testing PDF generation...');

pdfService.generateReport(testData, userData)
    .then(buffer => {
        console.log('✅ PDF generated successfully!');
        console.log('Buffer size:', buffer.length, 'bytes');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ PDF generation failed:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    });
