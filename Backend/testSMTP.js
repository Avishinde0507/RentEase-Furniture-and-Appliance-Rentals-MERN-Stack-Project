const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log('Testing SMTP for:', process.env.EMAIL_USER);

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Verification Failed!');
        console.error('Error details:', error.message);
        if (error.message.includes('Invalid login')) {
            console.log('\n💡 SUGGESTION: Your App Password might be incorrect or expired.');
        }
    } else {
        console.log('✅ SMTP Server is ready to send emails!');
    }
    process.exit();
});
