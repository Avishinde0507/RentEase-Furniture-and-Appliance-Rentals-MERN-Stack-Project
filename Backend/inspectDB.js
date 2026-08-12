const mongoose = require('mongoose');

// Using your exact URI from .env
const MONGODB_URI = 'mongodb+srv://ajinkyashinde6099_db_user:ajinkya6099@cluster0.jcqdiuc.mongodb.net/rentease?retryWrites=true&w=majority&appName=Cluster0';

async function checkProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB (rentease database)');
        
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products in database:`);
        products.forEach(p => {
            console.log(`- ${p.name} (${p.category}) [ID: ${p._id}]`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

checkProducts();
