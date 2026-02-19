const express = require('express');
const mongoose = require('mongoose');
const Batch = require('../models/Batch');
const blockchain = require('../services/blockchain');

const router = express.Router();

router.get('/', async (req, res) => {
    const startedAt = Date.now();

    try {
        const dbState = mongoose.connection.readyState;
        const dbStatus = dbState === 1 ? 'UP' : 'DOWN';

        const totalBatches = await Batch.countDocuments();
        const verifiedBatches = await Batch.countDocuments({ isSynced: true });

        const latestSyncedBatch = await Batch.findOne({ isSynced: true }).sort({ updatedAt: -1 }).select('updatedAt');

        const chainStats = blockchain.getStats();
        const responseTimeMs = Date.now() - startedAt;

        res.json({
            network: {
                name: 'Polygon Amoy',
                rpcStatus: chainStats.chainValid ? 'UP' : 'DEGRADED'
            },
            api: {
                status: 'UP',
                latencyMs: responseTimeMs
            },
            database: {
                status: dbStatus
            },
            sync: {
                lastSyncTime: latestSyncedBatch?.updatedAt || null,
                verificationRate: totalBatches === 0 ? 0 : Number(((verifiedBatches / totalBatches) * 100).toFixed(2))
            },
            blockchain: {
                chainValid: chainStats.chainValid,
                totalBlocks: chainStats.totalBlocks
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health route error:', error.message);
        res.status(500).json({
            status: 'ERROR',
            message: 'Unable to load health metrics',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
