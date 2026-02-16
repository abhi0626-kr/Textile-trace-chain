const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('../models/User');

async function deleteUser(email) {
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            return;
        }

        console.log(`\n⚠️  About to delete user:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.isVerified}\n`);

        // Delete the user
        await User.deleteOne({ email });

        console.log(`✅ Successfully deleted user: ${email}`);
        console.log(`   You can now re-register with this email if needed.\n`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log('Usage: node delete-user.js <email>');
    console.log('Example: node delete-user.js abhishek636kr@gmail.com');
    process.exit(1);
}

deleteUser(email);
