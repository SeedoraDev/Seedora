const mongoose = require('mongoose');
const APIKey = require('./models/APIKey');
const APIUsage = require('./models/APIUsage');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/seedora';

async function checkStats() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // The key provided by user starts with sk_live_1605
        const keyPrefix = 'sk_live_1605';

        const key = await APIKey.findOne({ keyPrefix });

        if (!key) {
            console.log('Key not found with prefix:', keyPrefix);
            return;
        }

        console.log('Found Key:', {
            id: key._id,
            prefix: key.keyPrefix,
            totalCalls: key.totalCalls,
            lastUsed: key.lastUsed
        });

        const usageCount = await APIUsage.countDocuments({ apiKeyId: key._id });
        console.log('Usage Count in APIUsage collection:', usageCount);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkStats();
