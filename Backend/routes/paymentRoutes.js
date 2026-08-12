const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments } = require('../controllers/paymentController');

router.route('/')
    .post(createPayment)
    .get(getAllPayments);

module.exports = router;
