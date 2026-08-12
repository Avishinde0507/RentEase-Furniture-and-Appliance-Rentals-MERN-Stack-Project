const Payment = require('../models/Payment');

// @desc    Record a new payment
// @route   POST /api/payments
exports.createPayment = async (req, res) => {
    try {
        const { customerName, paymentType, amount, orderId, transactionId } = req.body;

        const payment = await Payment.create({
            customerName,
            paymentType,
            amount,
            orderId,
            transactionId: transactionId || `TXN-${Math.floor(Math.random() * 1000000)}`
        });

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all payments
// @route   GET /api/payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
