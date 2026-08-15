const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../services/emailService');
const { formatIndianMobileNumber, sendMobileOTP, verifyMobileOTP } = require('../services/twilioService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Send OTP to Email
// @route   POST /api/auth/send-email-otp
exports.sendEmailOTP = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists with this email' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[AUTH ERROR] SMTP credentials missing in .env. Falling back to console log.`);
            console.log(`[VERIFICATION CODE] OTP ${otp} for ${email}`);
            return res.json({ 
                success: true, 
                message: 'Developer Mode: Check server console for code.', 
                otp: otp 
            });
        }

        const mailOptions = {
            to: email,
            subject: 'RentEase - Verify Your Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #ff4d4d; text-align: center;">Verify Your Email</h2>
                    <p>Thank you for choosing RentEase! Your verification code is:</p>
                    <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <h1 style="margin: 0; letter-spacing: 10px; color: #333;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                </div>
            `
        };
        
        try {
            await sendMail(mailOptions);
            console.log('✅ Email sent successfully to:', email);
            res.json({ 
                success: true, 
                message: 'Verification code sent to your email!', 
                otp: otp 
            });
        } catch (mailError) {
            console.warn(`⚠️ Cloud SMTP error (likely outbound SMTP blocked by hosting provider): ${mailError.message}`);
            console.log(`🔑 [VERIFICATION OTP] OTP ${otp} for ${email}`);
            res.json({ 
                success: true, 
                message: `Verification code generated! (Code: ${otp})`, 
                otp: otp,
                smtpFallback: true
            });
        }
    } catch (error) {
        console.error('Email Error:', error.message || error);
        res.status(500).json({ message: error.message || 'Failed to send verification email. Please check your inbox or try again.' });
    }
};

// @desc    Send Mobile OTP using Twilio Verify
// @route   POST /api/auth/send-mobile-otp
exports.sendMobileOTP = async (req, res) => {
    try {
        const { mobile } = req.body;

        const formattedMobile = formatIndianMobileNumber(mobile);
        if (!formattedMobile) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number"
            });
        }

        const rawMobile = formattedMobile.replace('+91', '');
        const userExists = await User.findOne({
            $or: [{ mobile: formattedMobile }, { mobile: rawMobile }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is already registered"
            });
        }

        await sendMobileOTP(mobile);

        return res.json({
            success: true,
            message: "OTP sent successfully to your mobile number"
        });
    } catch (error) {
        console.error("Send Mobile OTP Error:", error.message || error);
        let userMessage = error.message || "Failed to send OTP. Please try again.";
        if (error.code === 21608 || (error.message && error.message.toLowerCase().includes("unverified"))) {
            userMessage = "Twilio Trial Error: This mobile number is not verified in your Twilio Console (twilio.com/user/account/phone-numbers/verified).";
        }
        return res.status(error.status || 400).json({
            success: false,
            message: userMessage
        });
    }
};

// @desc    Verify Mobile OTP using Twilio Verify
// @route   POST /api/auth/verify-mobile-otp
exports.verifyMobileOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const formattedMobile = formatIndianMobileNumber(mobile);
        if (!formattedMobile) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number"
            });
        }

        if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
            return res.status(400).json({
                success: false,
                message: "OTP must contain exactly 6 digits"
            });
        }

        const verification = await verifyMobileOTP(mobile, otp.trim());

        if (verification && verification.status === "approved") {
            return res.json({
                success: true,
                message: "Mobile number verified successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
    } catch (error) {
        console.error("Verify Mobile OTP Error:", error.message || error);
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP"
        });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, mobile, password, otp, verifiedOtp } = req.body;
        
        if (otp && verifiedOtp && otp.toString().trim() !== verifiedOtp.toString().trim()) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) return res.status(400).json({ message: 'User already exists with this email or mobile' });

        const user = await User.create({ 
            name, 
            email, 
            mobile, 
            password,
            isVerified: true 
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                createdAt: user.createdAt,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile by email
// @route   GET /api/auth/user/:email
exports.getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            address: typeof user.address === 'string' ? user.address : (user.address?.street || ''),
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword)
            return res.status(400).json({ message: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        user.password = newPassword;
        await user.save();
        console.log(`✅ Password changed for ${email}`);

        res.json({ success: true, message: 'Password changed successfully!' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP for forgot password (to registered email)
// @route   POST /api/auth/forgot-password-otp
exports.forgotPasswordOTP = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email address.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[FORGOT PASSWORD OTP] ${otp} for ${email}`);
            return res.json({ success: true, message: 'Developer Mode: Check server console for OTP.', otp });
        }

        const mailOptions = {
            to: email,
            subject: 'RentEase - Password Reset Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #ff4d4d; text-align: center;">Reset Your Password</h2>
                    <p>We received a request to reset your RentEase password. Your reset code is:</p>
                    <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <h1 style="margin: 0; letter-spacing: 10px; color: #333;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
                </div>
            `
        };

        try {
            await sendMail(mailOptions);
            console.log(`✅ Forgot-password OTP sent to ${email}`);
            res.json({ success: true, message: 'Reset code sent to your email!', otp });
        } catch (mailError) {
            console.warn(`⚠️ Cloud SMTP error: ${mailError.message}`);
            console.log(`🔑 [FORGOT PASSWORD OTP] OTP ${otp} for ${email}`);
            res.json({ 
                success: true, 
                message: `Reset code generated! (Code: ${otp})`, 
                otp: otp,
                smtpFallback: true 
            });
        }
    } catch (error) {
        console.error('Forgot Password OTP Error:', error.message || error);
        res.status(500).json({ message: error.message || 'Failed to send reset email. Please try again.' });
    }
};

// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password are required.' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.password = newPassword;
        await user.save();
        console.log(`✅ Password reset for ${email}`);

        res.json({ success: true, message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const { email, name, mobile, address } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required to update profile' });

        let user = await User.findOne({ email });
        
        if (!user) {
            user = new User({
                name: name || 'User',
                email: email,
                mobile: mobile || '0000000000',
                password: 'defaultPassword123',
                role: 'user'
            });
        }

        if (name) user.name = name;
        if (mobile) user.mobile = mobile;
        if (address) {
            if (typeof address === 'string') {
                user.address = { street: address };
            } else {
                user.address = address;
            }
        }

        await user.save();
        console.log(`✅ Profile updated in MongoDB for ${email}`);

        res.json({
            success: true,
            message: 'Profile updated successfully in database!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                address: typeof address === 'string' ? address : (user.address?.street || ''),
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
};
