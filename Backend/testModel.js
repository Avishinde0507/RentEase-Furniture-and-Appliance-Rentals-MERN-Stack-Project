const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/rentease');
    try {
        const user = await User.create({
            name: 'Test', email: 'test@example.com', mobile: '1111111111', password: 'password123'
        });
        console.log('Success:', user);
    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit(0);
}
test();
