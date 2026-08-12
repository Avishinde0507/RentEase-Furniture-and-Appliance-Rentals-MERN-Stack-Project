const express = require('express');
const router = express.Router();
const { register, login, sendEmailOTP, sendMobileOTP, verifyMobileOTP, updateProfile, getUserProfile, changePassword, forgotPasswordOTP, resetPassword } = require('../controllers/authController');

router.post('/send-email-otp', sendEmailOTP);
router.post('/send-mobile-otp', sendMobileOTP);
router.post('/verify-mobile-otp', verifyMobileOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password-otp', forgotPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/user/:email', getUserProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
