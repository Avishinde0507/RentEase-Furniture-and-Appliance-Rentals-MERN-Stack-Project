const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        tenure: { type: Number, required: true }, // months
        monthlyRent: { type: Number, required: true }
    }],
    totalDeposit: { type: Number, required: true },
    totalMonthlyRent: { type: Number, required: true },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    deliveryDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Dispatched', 'Delivered', 'Active', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentStatus: { type: String, enum: ['Paid', 'Failed', 'Pending'], default: 'Pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
