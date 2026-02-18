const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @desc    Get notifications for current user (role-based + user-specific)
// @route   GET /api/notifications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const role = req.user.role;
        const userId = req.user.id;

        const notifications = await Notification.find({
            $or: [
                { roleTargets: role },
                { userTargets: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        res.json({ notifications });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
