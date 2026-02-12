const express = require('express');
const router = express.Router();
const blockchain = require('../services/blockchain');

// @desc    Get blockchain statistics
// @route   GET /api/blockchain/stats
// @access  Public
router.get('/stats', (req, res) => {
    try {
        const stats = blockchain.getStats();
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get the full blockchain
// @route   GET /api/blockchain/chain
// @access  Public
router.get('/chain', (req, res) => {
    try {
        const chain = blockchain.getChain();
        res.json({
            length: chain.length,
            chain: chain
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Verify blockchain integrity
// @route   GET /api/blockchain/verify
// @access   Public
router.get('/verify', (req, res) => {
    try {
        const verification = blockchain.verifyChain();
        res.json(verification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
