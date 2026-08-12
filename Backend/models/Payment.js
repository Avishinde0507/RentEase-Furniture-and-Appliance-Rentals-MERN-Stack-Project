const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required']
    },
    paymentType: {
        type: String,
        required: [true, 'Payment type is required'],
        enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery', 'Online Payment']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Completed'
    },
    orderId: {
        type: String
    },
    transactionId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
