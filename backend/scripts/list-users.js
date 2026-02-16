const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('../models/User');

async function listUsers() {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        
        if (users.length === 0) {
            console.log('\n📭 No users found in database\n');
            return;
        }

        console.log(`\n📋 Found ${users.length} user(s) in database:\n`);
        console.log('─'.repeat(100));
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.name}`);
            console.log(`   Email:        ${user.email}`);
            console.log(`   Role:         ${user.role}`);
            console.log(`   Verified:     ${user.isVerified ? '✅ Yes' : '❌ No'}`);
            console.log(`   Created:      ${new Date(user.createdAt).toLocaleString()}`);
            console.log(`   Organization: ${user.organizationId || 'N/A'}`);
            if (!user.isVerified && user.verificationToken) {
                console.log(`   Token Status: Has Token (Pending Verification)`);
            } else if (!user.isVerified && !user.verificationToken) {
                console.log(`   Token Status: ⚠️  Missing Token (Stuck Account)`);
            }
        });
        
        console.log('\n' + '─'.repeat(100) + '\n');
        
        // Summary
        const verified = users.filter(u => u.isVerified).length;
        const unverified = users.filter(u => !u.isVerified).length;
        const stuck = users.filter(u => !u.isVerified && !u.verificationToken).length;
        
        console.log('📊 Summary:');
        console.log(`   Total:      ${users.length}`);
        console.log(`   Verified:   ${verified}`);
        console.log(`   Unverified: ${unverified}`);
        if (stuck > 0) {
            console.log(`   ⚠️  Stuck:   ${stuck} (accounts without verification tokens)`);
        }
        console.log('');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

listUsers();
