const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: (process.env.EMAIL_USER || '').trim(),
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '')
    },
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
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
