const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('../models/User');

async function verifyUser(email) {
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            return;
        }

        if (user.isVerified) {
            console.log(`✅ User ${email} is already verified`);
            return;
        }

        // Manually verify the user
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token
        await user.save();

        console.log(`✅ Successfully verified user: ${email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   You can now login!`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log('Usage: node verify-user.js <email>');
    console.log('Example: node verify-user.js abhishek636kr@gmail.com');
    process.exit(1);
}

verifyUser(email);
