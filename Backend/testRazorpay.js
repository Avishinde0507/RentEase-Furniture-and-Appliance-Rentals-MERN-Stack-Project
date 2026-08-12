const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function test() {
    try {
        console.log('Testing with Amount: 7014');
        const options = {
            amount: 7014 * 100,
            currency: "INR",
            receipt: "receipt_test"
        };
        const order = await razorpay.orders.create(options);
        console.log('✅ Success:', order);
    } catch (error) {
        console.error('❌ Error Name:', error.constructor.name);
        console.error('❌ Error Message:', error.message);
        console.error('❌ Full Error:', JSON.stringify(error, null, 2));
    }
}

test();
