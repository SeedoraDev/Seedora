const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

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
        if (responseSent) return;
        
        try {
            if (code !== 0 && !dataToSend.trim()) {
                responseSent = true;
                return res.status(500).json({ error: 'Python script failed', details: errorData });
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
                res.status(500).json({ error: 'Failed to parse prediction result', details: e.message });
            }
        }
    });
});

module.exports = router;
