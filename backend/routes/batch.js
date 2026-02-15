const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const jwt = require('jsonwebtoken');
const blockchain = require('../services/blockchain');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Simple Geocoding Helper for Textile Hubs
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
    // Random offset near center of TN if unknown
    return { lat: 11.1271 + (Math.random() - 0.5) * 0.1, lng: 78.6569 + (Math.random() - 0.5) * 0.1 };
};

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    console.log('Incoming request to:', req.originalUrl);
    console.log('Token received:', token ? 'Yes (starts with ' + token.substring(0, 10) + '...)' : 'No');

    if (!token) {
        console.log('401: No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('Token verified for user:', req.user.id);
        next();
    } catch (err) {
        console.log('401: Token verification failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @desc    Create a new batch
// @route   POST /api/batch
// @access  Private (Farmer only)
router.post('/', auth, async (req, res) => {
    try {
        const { batchId, data } = req.body;

        // Check if batch exists
        let batch = await Batch.findOne({ batchId });
        if (batch) return res.status(400).json({ msg: 'Batch already exists' });

        // In a real app, verify user role is 'FARMER'
        // if (req.user.role !== 'FARMER') return res.status(403).json({ msg: 'Not authorized' });

        // Fetch current user details for readable name
        const User = require('../models/User');
        const currentUser = await User.findById(req.user.id);
        const ownerDisplay = currentUser ? `${currentUser.name} (${currentUser.role})` : req.user.id;

        const newBatch = new Batch({
            batchId,
            currentOwner: ownerDisplay,
            stage: 'RAW_COTTON',
            data: {
                ...data,
                originFarmer: ownerDisplay
            },
            history: [{
                stage: 'RAW_COTTON',
                timestamp: Date.now(),
                owner: ownerDisplay,
                location: data.location || 'Unknown',
                coordinates: getCoordinates(data.location)
            }]
        });

        await newBatch.save();

        // Log to blockchain
        const blockchainRecord = blockchain.logBatchCreation({
            batchId: newBatch.batchId,
            owner: req.user.id,
            stage: newBatch.stage,
            location: data.location,
            variety: data.variety
        });

        res.json({
            ...newBatch.toObject(),
            blockchainRecord
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get all batches (or filter by user role/ownership)
// @route   GET /api/batch
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Filter by isArchived if provided, default to showing only non-archived batches
        const showArchived = req.query.showArchived === 'true';
        const filter = showArchived ? {} : { isArchived: false };

        let batches = await Batch.find(filter).sort({ date: -1 });

        // Dynamic Resolver: If currentOwner looks like a MongoDB ID, resolve it to a name
        const User = require('../models/User');
        const resolvedBatches = await Promise.all(batches.map(async (batch) => {
            let batchObj = batch.toObject();

            // Regex for MongoDB ObjectId
            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (objectIdRegex.test(batchObj.currentOwner)) {
                console.log(`Resolving ID for batch ${batchObj.batchId}: ${batchObj.currentOwner}`);
                try {
                    const user = await User.findById(batchObj.currentOwner);
                    if (user) {
                        batchObj.currentOwner = `${user.name} (${user.role})`;
                        console.log(`Resolved to: ${batchObj.currentOwner}`);
                    } else {
                        console.log(`User ID ${batchObj.currentOwner} not found in database.`);
                        // Optional: If you want to show a placeholder for missing users
                        // batchObj.currentOwner = "Unknown User (Old ID)";
                    }
                } catch (err) {
                    console.error(`Error finding user ${batchObj.currentOwner}:`, err.message);
                }
            }

            // Apply same logic to history
            batchObj.history = await Promise.all(batchObj.history.map(async (h) => {
                if (objectIdRegex.test(h.owner)) {
                    try {
                        const hUser = await User.findById(h.owner);
                        if (hUser) h.owner = `${hUser.name} (${hUser.role})`;
                        else console.log(`History User ID ${h.owner} not found in database.`);
                    } catch (err) {
                        console.error(`Error finding history user ${h.owner}:`, err.message);
                    }
                }
                return h;
            }));

            return batchObj;
        }));

        res.json(resolvedBatches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @desc    Get network analytics summary
// @route   GET /api/batch/stats/summary
// @access  Public (or Private)
router.get('/stats/summary', async (req, res) => {
    try {
        const User = require('../models/User');
        const totalBatches = await Batch.countDocuments();
        const batches = await Batch.find();

        // Stage Distribution
        const stageDistribution = batches.reduce((acc, b) => {
            acc[b.stage] = (acc[b.stage] || 0) + 1;
            return acc;
        }, {});

        // Activity Over Last 7 Days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentActivity = await Batch.find({ updatedAt: { $gte: sevenDaysAgo } });

        const activityTrend = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString(undefined, { weekday: 'short' });
            const count = recentActivity.filter(b => b.updatedAt.toDateString() === d.toDateString()).length;
            activityTrend.unshift({ name: label, value: count });
        }

        // Participant Node Distribution
        const users = await User.find();
        const nodeDistribution = users.reduce((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
        }, {});

        res.json({
            summary: {
                totalUnits: totalBatches,
                activeNodes: users.length,
                healthScore: 98.4 // Simulated metric
            },
            stageData: Object.entries(stageDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value })),
            activityTrend,
            nodeData: Object.entries(nodeDistribution).map(([name, value]) => ({ name, value }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/batch/:id
// @access  Public (or Private)
router.get('/:id', async (req, res) => {
    try {
        const batch = await Batch.findOne({ batchId: req.params.id });
        if (!batch) return res.status(404).json({ msg: 'Batch not found' });

        let batchObj = batch.toObject();
        const User = require('../models/User');
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;

        // Resolve currentOwner
        if (objectIdRegex.test(batchObj.currentOwner)) {
            const user = await User.findById(batchObj.currentOwner);
            if (user) batchObj.currentOwner = `${user.name} (${user.role})`;
        }

        // Resolve history owners
        batchObj.history = await Promise.all(batchObj.history.map(async (h) => {
            if (objectIdRegex.test(h.owner)) {
                const hUser = await User.findById(h.owner);
                if (hUser) h.owner = `${hUser.name} (${hUser.role})`;
            }
            return h;
        }));

        res.json(batchObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Update batch stage / Transfer ownership
// @route   PUT /api/batch/:id/update
// @access  Private
router.put('/:id/update', auth, async (req, res) => {
    try {
        const { stage, data, newOwnerId } = req.body;

        let batch = await Batch.findOne({ batchId: req.params.id });
        if (!batch) return res.status(404).json({ msg: 'Batch not found' });

        // Check validation: Verify if the current user is the owner
        // In this MVP, we are lenient, but logically only owner can update.
        // if (batch.currentOwner !== req.user.id) return res.status(403).json({ msg: 'Not authorized (Not current owner)' });

        batch.stage = stage || batch.stage;

        // Ownership Transfer Logic
        if (newOwnerId) {
            // Verify if the user exists by Email (since frontend sends email)
            // or by ID if it's an ID. Let's support both or assume Email for user friendliness.
            // Currently frontend sends `newOwnerId` text input.
            const User = require('../models/User'); // Import User model inside request or at top

            // Check if it's a valid email or ID
            let newOwner = await User.findOne({ email: newOwnerId });
            if (!newOwner) {
                // Try by ID locally if email fail
                // newOwner = await User.findById(newOwnerId).catch(() => null);
                if (!newOwner) {
                    return res.status(400).json({ msg: `User with email '${newOwnerId}' not found. Cannot transfer ownership.` });
                }
            }

            // Update to new Owner ID (or keep email? Model says currentOwner: String)
            // Best practice: Store User ID as reference, but for display might use name/email.
            // Let's stick to storing what we have OR consistent ID. 
            // Existing code used req.user.id for creation. So we should store newOwner._id
            batch.currentOwner = newOwner.email; // Storing Email for readability in MVP or ID? 
            // Let's look at how we display it. Dashboard shows `batch.currentOwner`. 
            // If we switched to ID, the dashboard would show an ugly ID.
            // For this MVP, let's switch to storing EMAIL as the owner identifier for visibility,
            // OR keep ID and populate it. 
            // Given the current simple implementation:
            // 1. Creation uses req.user.id (likely a MongoDB Object ID)
            // 2. Display shows that ID.
            // Let's consistency: Store EMAIL for currentOwner so it's readable?
            // Or better: Store Role? 

            // Let's stick to: Store EMAIL if found, or ID if found.
            // Actually, let's just use the Email since that's what the UI sends.
            batch.currentOwner = newOwner.role; // Actually, maybe ownership is by ROLE in this supply chain? 
            // No, specific user.

            // Let's store the User's Name or Email for better UX in dashboard
            batch.currentOwner = newOwner.name + ` (${newOwner.role})`;
        }

        if (data) batch.data = { ...batch.data, ...data };

        // Fetch current user details to store readable name in history
        const User = require('../models/User');
        const currentUser = await User.findById(req.user.id);
        const currentUserDisplay = currentUser ? `${currentUser.name} (${currentUser.role})` : req.user.id;

        batch.history.push({
            stage: stage || batch.stage,
            timestamp: Date.now(),
            owner: currentUserDisplay, // Store Name + Role
            location: (data && data.location) ? data.location : (batch.data.location || 'Unknown'), // Use new provided location or fallback
            coordinates: getCoordinates((data && data.location) ? data.location : batch.data.location)
        });

        await batch.save();

        // Log to blockchain
        let blockchainRecord;
        const io = req.app.get('socketio');

        if (newOwnerId) {
            // Log ownership transfer
            blockchainRecord = blockchain.logOwnershipTransfer(batch.batchId, {
                fromOwner: req.user.id,
                toOwner: newOwnerId
            });

            // Emit Real-time Notification for Incoming Control
            io.to(newOwnerId).emit('notification', {
                type: 'TRANSFER',
                msg: `Incoming Control: Batch ${batch.batchId} has been transferred to you.`,
                timestamp: Date.now(),
                batchId: batch.batchId
            });
        } else {
            // Log stage update
            blockchainRecord = blockchain.logStageUpdate(batch.batchId, {
                stage: stage || batch.stage,
                location: (data && data.location) ? data.location : batch.data.location,
                handler: currentUser ? currentUser.name : req.user.id
            });

            // Emit Broad Notification for interested nodes (simple broad for now or specific targets)
            io.emit('notification', {
                type: 'UPDATE',
                msg: `Ledger Synchronized: Batch ${batch.batchId} updated to ${batch.stage.replace('_', ' ')}.`,
                timestamp: Date.now(),
                batchId: batch.batchId
            });
        }

        res.json({
            ...batch.toObject(),
            blockchainRecord
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Toggle batch archive status
// @route   PUT /api/batch/:id/archive
// @access  Private
router.put('/:id/archive', auth, async (req, res) => {
    try {
        let batch = await Batch.findOne({ batchId: req.params.id });
        if (!batch) return res.status(404).json({ msg: 'Batch not found' });

        // Toggle archive status
        batch.isArchived = !batch.isArchived;
        await batch.save();

        // Log to blockchain if archiving
        let blockchainRecord;
        if (batch.isArchived) {
            blockchainRecord = blockchain.logBatchArchival(batch.batchId);
        }

        res.json({
            msg: batch.isArchived ? 'Batch archived' : 'Batch unarchived',
            batch,
            blockchainRecord
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Upload document for a batch
// @route   POST /api/batch/:id/upload
// @access  Private
router.post('/:id/upload', [auth, upload.single('document')], async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        let batch = await Batch.findOne({ batchId: req.params.id });
        if (!batch) return res.status(404).json({ msg: 'Batch not found' });

        // Cryptographic Hashing for Immutability
        const fileBuffer = fs.readFileSync(req.file.path);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const fileHash = hashSum.digest('hex');

        const newDoc = {
            filename: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            fileHash: fileHash
        };

        batch.documents.push(newDoc);
        await batch.save();

        // Optional: Log document upload to blockchain
        // blockchain.logDocumentUpload(batch.batchId, newDoc);

        res.json({
            msg: 'Document uploaded successfully',
            document: newDoc,
            batch
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
