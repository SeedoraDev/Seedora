const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const APIKey = require('../models/APIKey');
const APIUsage = require('../models/APIUsage');

// Generate a secure random API key
function generateApiKey() {
    const prefix = 'sk_live_';
    const randomBytes = crypto.randomBytes(16);
    const randomPart = randomBytes.toString('hex'); // 32 hex characters
    return prefix + randomPart;
}

// POST /api/developer/keys/generate - Generate new API key
router.post('/keys/generate', auth, async (req, res) => {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || !name.trim()) {
            return res.status(400).json({
                error: 'Name is required',
                message: 'Please provide a name for your API key'
            });
        }

        // Generate API key
        const apiKey = generateApiKey();
        const keyPrefix = apiKey.substring(0, 12);

        // Hash the key
        const salt = await bcrypt.genSalt(10);
        const keyHash = await bcrypt.hash(apiKey, salt);

        // Create new API key record
        const newKey = new APIKey({
            userId: req.user.id,
            name: name.trim(),
            keyHash,
            keyPrefix,
            rateLimit: {
                hourly: 100,
                daily: 1000
            }
        });

        await newKey.save();

        // Return the key (ONE TIME ONLY)
        res.json({
            id: newKey._id,
            name: newKey.name,
            key: apiKey, // Full key returned only once
            keyPrefix: newKey.keyPrefix,
            createdAt: newKey.createdAt,
            rateLimit: newKey.rateLimit
        });
    } catch (error) {
        console.error('Generate API key error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to generate API key'
        });
    }
});

// GET /api/developer/keys - Get all API keys for user
router.get('/keys', auth, async (req, res) => {
    try {
        const keys = await APIKey.find({
            userId: req.user.id,
            isActive: true
        }).select('-keyHash').sort({ createdAt: -1 });

        res.json(keys);
    } catch (error) {
        console.error('Get API keys error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch API keys'
        });
    }
});

// DELETE /api/developer/keys/:id - Delete an API key
router.delete('/keys/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the key and verify ownership
        const apiKey = await APIKey.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!apiKey) {
            return res.status(404).json({
                error: 'API key not found',
                message: 'The specified API key does not exist or does not belong to you'
            });
        }

        // Delete the key
        await APIKey.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'API key deleted successfully'
        });
    } catch (error) {
        console.error('Delete API key error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to delete API key'
        });
    }
});

// GET /api/developer/stats - Get usage statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        // Calculate time ranges
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all user's API keys
        const userKeys = await APIKey.find({ userId, isActive: true });
        const keyIds = userKeys.map(key => key._id);

        if (keyIds.length === 0) {
            return res.json({
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                rateLimit: {
                    hourly: { used: 0, total: 100 },
                    daily: { used: 0, total: 1000 }
                },
                recentCalls: []
            });
        }

        // Count calls for different periods
        const [todayCount, weekCount, monthCount, recentCalls] = await Promise.all([
            APIUsage.countDocuments({
                apiKeyId: { $in: keyIds },
                timestamp: { $gte: startOfToday }
            }),
            APIUsage.countDocuments({
                apiKeyId: { $in: keyIds },
                timestamp: { $gte: startOfWeek }
            }),
            APIUsage.countDocuments({
                apiKeyId: { $in: keyIds },
                timestamp: { $gte: startOfMonth }
            }),
            APIUsage.find({
                apiKeyId: { $in: keyIds }
            })
                .sort({ timestamp: -1 })
                .limit(10)
                .select('endpoint statusCode responseTime timestamp')
        ]);

        // Calculate rate limit usage (for the most used key)
        const hourAgo = new Date(now - 60 * 60 * 1000);
        const hourlyUsage = await APIUsage.countDocuments({
            apiKeyId: { $in: keyIds },
            timestamp: { $gte: hourAgo }
        });

        const dailyUsage = await APIUsage.countDocuments({
            apiKeyId: { $in: keyIds },
            timestamp: { $gte: startOfToday }
        });

        res.json({
            today: todayCount,
            thisWeek: weekCount,
            thisMonth: monthCount,
            rateLimit: {
                hourly: {
                    used: hourlyUsage,
                    total: 100,
                    remaining: Math.max(0, 100 - hourlyUsage)
                },
                daily: {
                    used: dailyUsage,
                    total: 1000,
                    remaining: Math.max(0, 1000 - dailyUsage)
                }
            },
            recentCalls: recentCalls.map(call => ({
                endpoint: call.endpoint,
                statusCode: call.statusCode,
                responseTime: call.responseTime,
                timestamp: call.timestamp
            }))
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch usage statistics'
        });
    }
});

module.exports = router;
