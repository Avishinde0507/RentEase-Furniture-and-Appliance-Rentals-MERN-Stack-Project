const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/payment', require('./routes/razorpayRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/extend', require('./routes/extendRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
    res.send('RentEase API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentease')
.then(() => console.log('✅ MongoDB Connected to Atlas'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Emails will be sent from: ${process.env.EMAIL_USER}`);
    console.log(`📱 Twilio Verify SID: ${process.env.TWILIO_VERIFY_SERVICE_SID ? 'Configured ✅' : 'Missing ❌'}`);
});
