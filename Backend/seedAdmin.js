const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/rentease';
        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB...');

        const adminEmail = 'avishkarshinde0507@gmail.com';
        const adminPassword = 'Avi_Shinde_0507';

        // Check for existing admin or user with adminEmail
        let adminUser = await User.findOne({ $or: [{ role: 'admin' }, { email: adminEmail }] });

        if (adminUser) {
            console.log('Updating existing Admin user...');
            adminUser.email = adminEmail;
            adminUser.password = adminPassword;
            adminUser.role = 'admin';
            adminUser.isVerified = true;
            await adminUser.save();
            console.log('Admin user credentials updated successfully!');
        } else {
            adminUser = new User({
                name: 'Super Admin',
                email: adminEmail,
                mobile: '9999999999',
                password: adminPassword, // Will be hashed by pre-save hook
                role: 'admin',
                isVerified: true,
                referralCode: 'ADMIN100'
            });
            await adminUser.save();
            console.log('Admin user created successfully!');
        }

        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
