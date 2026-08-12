const express = require('express');
const router = express.Router();
const { createOrder, getKey, verifyPayment } = require('../controllers/razorpayController');

router.post('/create-order', createOrder);
router.get('/get-key', getKey);
router.post('/verify', verifyPayment);

module.exports = router;
