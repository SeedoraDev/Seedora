const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const validateApiKey = require('../middleware/validateApiKey');
const APIKey = require('../models/APIKey');
const APIUsage = require('../models/APIUsage');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Versioned endpoint with API key authentication
router.post('/v1/predict', validateApiKey, (req, res) => {
    const startTime = Date.now();

    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err.message);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Process image and track usage
        await processImageWithTracking(req, res, startTime);
    });
});

// Original endpoint (backward compatibility)
router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err.message);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        processImage(req, res);
    });
});

function processImage(req, res) {

    const imagePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../Ml/predict.py');

    const pythonProcess = spawn('python3', [pythonScriptPath, imagePath]);

    let dataToSend = '';
    let errorData = '';
    let responseSent = false;

    pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`stderr: ${data}`);
        // Don't send error response immediately - stderr might just be warnings
    });

    pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        if (responseSent) return;

        try {
            if (code !== 0 && !dataToSend.trim()) {
                responseSent = true;
                console.error('Python script failed with code:', code);
                console.error('Error details:', errorData);
                return res.status(500).json({
                    error: 'Analysis failed',
                    details: errorData || 'Python script execution failed'
                });
            }

            if (!dataToSend.trim()) {
                responseSent = true;
                return res.status(500).json({ error: 'No output from analysis script' });
            }

            const result = JSON.parse(dataToSend);
            if (result.error) {
                responseSent = true;
                return res.status(500).json({ error: result.error });
            }

            responseSent = true;
            res.json(result);
        } catch (e) {
            if (!responseSent) {
                responseSent = true;
                console.error('Failed to parse result:', e.message);
                console.error('Raw output:', dataToSend);
                res.status(500).json({
                    error: 'Failed to parse prediction result',
                    details: e.message,
                    rawOutput: dataToSend.substring(0, 200)
                });
            }
        }
    });

    // Handle timeout
    setTimeout(() => {
        if (!responseSent) {
            responseSent = true;
            pythonProcess.kill();
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            res.status(500).json({ error: 'Analysis timeout - please try again' });
        }
    }, 30000); // 30 second timeout
}

// Process image with usage tracking (for API key authenticated requests)
async function processImageWithTracking(req, res, startTime) {
    const imagePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../Ml/predict.py');

    const pythonProcess = spawn('python3', [pythonScriptPath, imagePath]);

    let dataToSend = '';
    let errorData = '';
    let responseSent = false;

    pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
        // Clean up uploaded file
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        if (responseSent) return;

        const responseTime = Date.now() - startTime;
        let statusCode = 200;
        let result = null;

        try {
            if (code !== 0 && !dataToSend.trim()) {
                statusCode = 500;
                responseSent = true;
                console.error('Python script failed with code:', code);
                console.error('Error details:', errorData);

                // Track failed request
                await trackUsage(req, statusCode, responseTime);

                return res.status(statusCode).json({
                    error: 'Analysis failed',
                    details: errorData || 'Python script execution failed'
                });
            }

            if (!dataToSend.trim()) {
                statusCode = 500;
                responseSent = true;

                // Track failed request
                await trackUsage(req, statusCode, responseTime);

                return res.status(statusCode).json({ error: 'No output from analysis script' });
            }

            result = JSON.parse(dataToSend);
            if (result.error) {
                statusCode = 500;
                responseSent = true;

                // Track failed request
                await trackUsage(req, statusCode, responseTime);

                return res.status(statusCode).json({ error: result.error });
            }

            responseSent = true;

            // Track successful request
            await trackUsage(req, statusCode, responseTime);

            // Update API key stats
            await APIKey.findByIdAndUpdate(req.apiKey._id, {
                lastUsed: new Date(),
                $inc: { totalCalls: 1 }
            });

            res.json(result);
        } catch (e) {
            if (!responseSent) {
                statusCode = 500;
                responseSent = true;
                console.error('Failed to parse result:', e.message);
                console.error('Raw output:', dataToSend);

                // Track failed request
                await trackUsage(req, statusCode, responseTime);

                res.status(statusCode).json({
                    error: 'Failed to parse prediction result',
                    details: e.message,
                    rawOutput: dataToSend.substring(0, 200)
                });
            }
        }
    });

    // Handle timeout
    setTimeout(() => {
        if (!responseSent) {
            responseSent = true;
            pythonProcess.kill();
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            const statusCode = 500;
            const responseTime = Date.now() - startTime;

            // Track timeout
            trackUsage(req, statusCode, responseTime).catch(console.error);

            res.status(statusCode).json({ error: 'Analysis timeout - please try again' });
        }
    }, 30000); // 30 second timeout
}

// Helper function to track API usage
async function trackUsage(req, statusCode, responseTime) {
    try {
        await APIUsage.create({
            apiKeyId: req.apiKey._id,
            userId: req.userId,
            endpoint: '/v1/predict',
            statusCode,
            responseTime,
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });
    } catch (error) {
        console.error('Failed to track usage:', error);
        // Don't throw - tracking failure shouldn't break the request
    }
}

module.exports = router;
