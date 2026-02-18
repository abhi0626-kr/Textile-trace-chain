const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    batchId: {
        type: String,
        default: null
    },
    roleTargets: {
        type: [String],
        default: []
    },
    userTargets: {
        type: [String],
        default: []
    },
    metadata: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
