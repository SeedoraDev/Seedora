const mongoose = require('mongoose');

const APIKeySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    keyHash: {
        type: String,
        required: true
    },
    keyPrefix: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsed: {
        type: Date,
        default: null
    },
    totalCalls: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rateLimit: {
        hourly: {
            type: Number,
            default: 100
        },
        daily: {
            type: Number,
            default: 1000
        }
    }
}, { timestamps: true });

// Index for faster lookups
APIKeySchema.index({ userId: 1, isActive: 1 });
APIKeySchema.index({ keyPrefix: 1, isActive: 1 });

module.exports = mongoose.model('APIKey', APIKeySchema);
