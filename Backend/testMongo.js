const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/rentease', {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s
        });
        console.log('✅ Success: Connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error: Could not connect to MongoDB.');
        console.error('Details:', err.message);
        process.exit(1);
    }
}

testConnection();
