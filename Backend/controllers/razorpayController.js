const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Initialize Razorpay here to ensure it uses current env variables
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        
        const options = {
            amount: Math.round(amount * 100), // Amount in paise, ensured integer
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('❌ Razorpay Order Creation Error:', error);
        const errorMessage = error.description || (error.error && error.error.description) || error.message || 'Unknown Razorpay Error';
        res.status(500).json({ 
            error: errorMessage, 
            details: error
        });
    }
};

// @desc    Get Razorpay Key
// @route   GET /api/payment/get-key
exports.getKey = (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
    }
};
