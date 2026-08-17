const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const compression = require('compression');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS — allow Render frontend + Vercel + localhost
const allowedOrigins = [
    'https://rentease-furniture-and-appliance-rentals.onrender.com',
    'https://rentease-furniture-and-appliance-rentals-p2ra.onrender.com',
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
].filter(Boolean);

// Performance Middlewares
app.use(compression());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o)) || origin.includes('onrender.com') || origin.includes('vercel.app')) {
            return callback(null, true);
        }
        return callback(null, true); // Open CORS for now — tighten in production
    },
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Fast Health & Keep-Alive Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
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
    res.send('RentEase API is running fast & healthy...');
});

// Database Connection with optimized connection pooling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentease', {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
    .then(() => console.log('✅ MongoDB Connected to Atlas (Optimized Pool)'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Emails will be sent from: ${process.env.EMAIL_USER}`);
    console.log(`📱 Twilio Verify SID: ${process.env.TWILIO_VERIFY_SERVICE_SID ? 'Configured ✅' : 'Missing ❌'}`);

    // Self keep-alive ping to prevent Render free instance from sleeping
    const backendUrl = process.env.RENDER_EXTERNAL_URL || 'https://rentease-furniture-and-appliance-rentals.onrender.com';
    setInterval(() => {
        if (backendUrl && backendUrl.startsWith('http')) {
            fetch(`${backendUrl}/api/health`)
                .then(() => console.log(`💓 Keep-alive ping sent to ${backendUrl}`))
                .catch((e) => console.warn(`Keep-alive ping failed: ${e.message}`));
        }
    }, 14 * 60 * 1000); // Every 14 minutes
});
