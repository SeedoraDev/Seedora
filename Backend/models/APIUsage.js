const mongoose = require('mongoose');

const APIUsageSchema = new mongoose.Schema({
    apiKeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'APIKey',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    endpoint: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number, // milliseconds
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
});

// Compound indexes for efficient queries
APIUsageSchema.index({ apiKeyId: 1, timestamp: -1 });
APIUsageSchema.index({ userId: 1, timestamp: -1 });

// TTL index to auto-delete records older than 30 days
APIUsageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('APIUsage', APIUsageSchema);
