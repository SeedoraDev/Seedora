const bcrypt = require('bcryptjs');
const APIKey = require('../models/APIKey');
const APIUsage = require('../models/APIUsage');

async function checkRateLimits(apiKey) {
    const now = new Date();
    const hourAgo = new Date(now - 60 * 60 * 1000);
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Count calls in last hour
    const hourlyCount = await APIUsage.countDocuments({
        apiKeyId: apiKey._id,
        timestamp: { $gte: hourAgo }
    });

    // Count calls in last day
    const dailyCount = await APIUsage.countDocuments({
        apiKeyId: apiKey._id,
        timestamp: { $gte: dayAgo }
    });

    // Check hourly limit
    if (hourlyCount >= apiKey.rateLimit.hourly) {
        return {
            exceeded: true,
            limit: apiKey.rateLimit.hourly,
            period: 'hour',
            resetAt: new Date(hourAgo.getTime() + 60 * 60 * 1000)
        };
    }

    // Check daily limit
    if (dailyCount >= apiKey.rateLimit.daily) {
        return {
            exceeded: true,
            limit: apiKey.rateLimit.daily,
            period: 'day',
            resetAt: new Date(dayAgo.getTime() + 24 * 60 * 60 * 1000)
        };
    }

    return {
        exceeded: false,
        hourlyUsed: hourlyCount,
        dailyUsed: dailyCount
    };
}

async function validateApiKey(req, res, next) {
    try {
        // 1. Extract API key from header
        const apiKey = req.header('X-API-Key');

        // 2. Check if key provided
        if (!apiKey) {
            return res.status(401).json({
                error: 'API key required',
                message: 'Please provide an API key in the X-API-Key header'
            });
        }

        // 3. Validate key format
        if (!apiKey.startsWith('sk_live_') || apiKey.length !== 40) {
            return res.status(401).json({
                error: 'Invalid API key format',
                message: 'API key must start with sk_live_ and be 40 characters long'
            });
        }

        // 4. Find keys by prefix
        const keyPrefix = apiKey.substring(0, 12);
        const keys = await APIKey.find({ keyPrefix, isActive: true });

        if (keys.length === 0) {
            return res.status(401).json({
                error: 'Invalid API key',
                message: 'The provided API key is invalid or has been deactivated'
            });
        }

        // 5. Compare hash for each matching prefix
        let matchedKey = null;
        for (const key of keys) {
            const isMatch = await bcrypt.compare(apiKey, key.keyHash);
            if (isMatch) {
                matchedKey = key;
                break;
            }
        }

        // 6. Check if key found
        if (!matchedKey) {
            return res.status(401).json({
                error: 'Invalid API key',
                message: 'The provided API key is invalid or has been deactivated'
            });
        }

        // 7. Check rate limits
        const rateLimitStatus = await checkRateLimits(matchedKey);
        if (rateLimitStatus.exceeded) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: `You have exceeded the ${rateLimitStatus.period}ly rate limit of ${rateLimitStatus.limit} requests`,
                limit: rateLimitStatus.limit,
                period: rateLimitStatus.period,
                resetAt: rateLimitStatus.resetAt
            });
        }

        // 8. Attach key and user to request
        req.apiKey = matchedKey;
        req.userId = matchedKey.userId;
        req.rateLimitStatus = rateLimitStatus;

        // 9. Continue to next middleware
        next();
    } catch (error) {
        console.error('API key validation error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while validating your API key'
        });
    }
}

module.exports = validateApiKey;
