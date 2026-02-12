const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true
    },
    currentOwner: {
        type: String, // User ID or Org ID
        required: true
    },
    stage: {
        type: String,
        enum: ['RAW_COTTON', 'GINNED', 'SPUN_YARN', 'WOVEN_FABRIC', 'DYED', 'GARMENT_FINISHED', 'SHIPPED'],
        required: true
    },
    data: {
        type: Object, // Store all other details (json)
        required: true
    },
    history: [
        {
            stage: String,
            timestamp: Date,
            owner: String,
            location: String, // Add location to track movement
            coordinates: {
                lat: Number,
                lng: Number
            },
            txId: String // Blockchain Transaction ID
        }
    ],
    isSynced: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    documents: [
        {
            filename: String,
            url: String, // Path or URL to the file
            timestamp: { type: Date, default: Date.now },
            fileHash: String // SHA-256 hash of the file for immutability
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
