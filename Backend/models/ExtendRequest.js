const mongoose = require('mongoose');

const extendRequestSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    user: { type: String, required: true },
    product: { type: String, required: true },
    currentTenure: { type: String, required: true },
    requestedTenure: { type: String, required: true },
    amount: { type: Number },
    paymentId: { type: String },
    paymentStatus: { type: String, default: 'Paid' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('ExtendRequest', extendRequestSchema);
