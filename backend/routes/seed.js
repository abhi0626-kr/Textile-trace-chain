const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const User = require('../models/User');

// Helper function for coordinates (reused from batch.js)
const getCoordinates = (location) => {
    const hubs = {
        'salem': { lat: 11.6643, lng: 78.1460 },
        'erode': { lat: 11.3410, lng: 77.7172 },
        'tirupur': { lat: 11.1085, lng: 77.3411 },
        'coimbatore': { lat: 11.0168, lng: 76.9558 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'karur': { lat: 10.9601, lng: 78.0766 },
        'madurai': { lat: 9.9252, lng: 78.1198 }
    };
    const key = (location || '').toLowerCase().trim();
    for (const hub in hubs) {
        if (key.includes(hub)) return hubs[hub];
    }
    return { lat: 11.1271 + (Math.random() - 0.5) * 0.1, lng: 78.6569 + (Math.random() - 0.5) * 0.1 };
};

// @desc    Generate seed data for testing
// @route   POST /api/seed/batches
// @access  Public (for development only)
router.post('/batches', async (req, res) => {
    try {
        // Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ msg: 'Seeding is disabled in production' });
        }

        const { count = 10 } = req.body;

        // Find a farmer user to assign as owner
        const farmer = await User.findOne({ role: 'FARMER' });
        if (!farmer) {
            return res.status(400).json({ msg: 'No farmer user found. Please create a farmer account first.' });
        }

        const ownerDisplay = `${farmer.name} (${farmer.role})`;

        const stages = ['RAW_COTTON', 'GINNED', 'SPUN_YARN', 'WOVEN_FABRIC', 'DYED', 'GARMENT_FINISHED'];
        const locations = ['Salem, Tamil Nadu', 'Erode, Tamil Nadu', 'Tirupur, Tamil Nadu', 'Coimbatore, Tamil Nadu', 'Karur, Tamil Nadu'];
        const varieties = ['MCU-5', 'Suraj', 'Brahma', 'DCH-32'];

        const batches = [];

        for (let i = 0; i < count; i++) {
            const batchId = `COT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
            
            // Check if batch already exists
            const exists = await Batch.findOne({ batchId });
            if (exists) {
                continue; // Skip if duplicate
            }

            const location = locations[Math.floor(Math.random() * locations.length)];
            const variety = varieties[Math.floor(Math.random() * varieties.length)];
            const stage = stages[Math.floor(Math.random() * stages.length)];
            
            const harvestDate = new Date();
            harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 30));

            const newBatch = new Batch({
                batchId,
                currentOwner: ownerDisplay,
                stage,
                data: {
                    location,
                    variety,
                    harvestDate: harvestDate.toISOString().split('T')[0],
                    originFarmer: ownerDisplay
                },
                history: [{
                    stage: 'RAW_COTTON',
                    timestamp: harvestDate.getTime(),
                    owner: ownerDisplay,
                    location,
                    coordinates: getCoordinates(location)
                }]
            });

            // Add additional history entries if stage is advanced
            const stageIndex = stages.indexOf(stage);
            for (let j = 1; j <= stageIndex; j++) {
                const historyDate = new Date(harvestDate);
                historyDate.setDate(historyDate.getDate() + (j * 5));
                
                newBatch.history.push({
                    stage: stages[j],
                    timestamp: historyDate.getTime(),
                    owner: ownerDisplay,
                    location: locations[Math.floor(Math.random() * locations.length)],
                    coordinates: getCoordinates(location)
                });
            }

            await newBatch.save();
            batches.push(newBatch);
        }

        res.json({
            msg: `Successfully created ${batches.length} seed batches`,
            batches: batches.map(b => ({ batchId: b.batchId, stage: b.stage }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
