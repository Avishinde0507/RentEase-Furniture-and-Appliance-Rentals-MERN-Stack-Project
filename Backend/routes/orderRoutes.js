const express = require('express');
const router = express.Router();
const { sendOrderConfirmation, createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/send-confirmation', sendOrderConfirmation);
router.post('/create', createOrder);
router.get('/all', getAllOrders);
router.put('/update-status', updateOrderStatus);

module.exports = router;
