const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ajinkyashinde6099_db_user:ajinkya6099@cluster0.jcqdiuc.mongodb.net/rentease?retryWrites=true&w=majority&appName=Cluster0';

async function fixDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Drop the problematic unique index on referralCode
        try {
            await mongoose.connection.db.collection('users').dropIndex('referralCode_1');
            console.log('✅ Success: Dropped the broken referralCode index!');
        } catch (e) {
            console.log('ℹ️ Note: Index already gone or not found. That is fine!');
        }
        
        await mongoose.disconnect();
        console.log('🚀 Database is now ready for new registrations!');
    } catch (err) {
        console.error('❌ Error fixing database:', err);
    }
}

fixDatabase();
