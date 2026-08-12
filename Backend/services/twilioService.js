const twilio = require('twilio');

/**
 * Formats and validates an Indian mobile number into E.164 (+91XXXXXXXXXX) format.
 * Validates that the core 10-digit mobile number starts with 6, 7, 8, or 9.
 * @param {string} mobile
 * @returns {string|null} Formatted mobile number or null if invalid
 */
const formatIndianMobileNumber = (mobile) => {
    if (!mobile) return null;
    let cleaned = mobile.toString().trim().replace(/[\s\-\(\)]/g, '');
    
    if (cleaned.startsWith('+91')) {
        cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
        cleaned = cleaned.substring(1);
    }

    if (/^[6-9]\d{9}$/.test(cleaned)) {
        return `+91${cleaned}`;
    }
    return null;
};

/**
 * Sends SMS OTP using Twilio Verify service
 * @param {string} mobile 
 * @returns {Promise<object>} Twilio verification response
 */
const sendMobileOTP = async (mobile) => {
    const formattedMobile = formatIndianMobileNumber(mobile);
    if (!formattedMobile) {
        throw new Error('Please enter a valid 10-digit mobile number');
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.trim() : '';
    const authToken = process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.trim() : '';
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID ? process.env.TWILIO_VERIFY_SERVICE_SID.trim() : '';

    if (!accountSid || !authToken || !serviceSid) {
        throw new Error('Twilio configuration is missing on server. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID in Backend/.env.');
    }

    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
        .services(serviceSid)
        .verifications
        .create({
            to: formattedMobile,
            channel: 'sms'
        });

    return verification;
};

/**
 * Verifies SMS OTP using Twilio Verify service
 * @param {string} mobile 
 * @param {string} otp 
 * @returns {Promise<object>} Twilio verification check response
 */
const verifyMobileOTP = async (mobile, otp) => {
    const formattedMobile = formatIndianMobileNumber(mobile);
    if (!formattedMobile) {
        throw new Error('Please enter a valid 10-digit mobile number');
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.trim() : '';
    const authToken = process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.trim() : '';
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID ? process.env.TWILIO_VERIFY_SERVICE_SID.trim() : '';

    if (!accountSid || !authToken || !serviceSid) {
        throw new Error('Twilio configuration is missing on server. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID in Backend/.env.');
    }

    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks
        .create({
            to: formattedMobile,
            code: otp
        });

    return verificationCheck;
};

module.exports = {
    formatIndianMobileNumber,
    sendMobileOTP,
    verifyMobileOTP
};
