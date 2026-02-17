const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT"]
    }
});

// Attach io to app for access in routes
app.set('socketio', io);

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('A user connected to the notification network');

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their private Notification Channel`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from network');
    });
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false, // Required to serve static images to frontend
}));
app.use(morgan('dev'));

// Static files for document uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const batchRoutes = require('./routes/batch');
const blockchainRoutes = require('./routes/blockchain');
const seedRoutes = require('./routes/seed');
app.use('/api/auth', authRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/seed', seedRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Smart Server running on port ${PORT} with WebSocket Sync`);
});
