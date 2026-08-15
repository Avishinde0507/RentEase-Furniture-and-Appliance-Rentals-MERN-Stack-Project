const nodemailer = require('nodemailer');

const getCleanEmailCredentials = () => {
    return {
        user: (process.env.EMAIL_USER || '').trim(),
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '') // remove spaces from Google App Password
    };
};

const createPrimaryTransporter = () => {
    const creds = getCleanEmailCredentials();
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: creds.user,
            pass: creds.pass
        },
        family: 4, // Force IPv4 (essential for Render / Cloud hosting)
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
            rejectUnauthorized: false
        }
    });
};

const createFallbackTransporter = () => {
    const creds = getCleanEmailCredentials();
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // STARTTLS
        auth: {
            user: creds.user,
            pass: creds.pass
        },
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
            rejectUnauthorized: false
        }
    });
};

let primaryTransporter = createPrimaryTransporter();
let fallbackTransporter = createFallbackTransporter();

/**
 * Sends an email using primary (port 465) or fallback (port 587) Gmail SMTP transport
 * @param {object} mailOptions 
 * @returns {Promise<object>}
 */
const sendMail = async (mailOptions) => {
    const creds = getCleanEmailCredentials();
    if (!creds.user || !creds.pass) {
        throw new Error('EMAIL_USER or EMAIL_PASS is missing in environment variables.');
    }

    const options = {
        ...mailOptions,
        from: mailOptions.from || `"RentEase" <${creds.user}>`
    };

    try {
        const info = await primaryTransporter.sendMail(options);
        console.log(`✅ Email sent successfully via Port 465 to: ${options.to}`);
        return info;
    } catch (primaryError) {
        console.warn(`⚠️ Primary SMTP (Port 465) failed: ${primaryError.message}. Retrying via Port 587...`);
        try {
            const info = await fallbackTransporter.sendMail(options);
            console.log(`✅ Email sent successfully via Port 587 to: ${options.to}`);
            return info;
        } catch (fallbackError) {
            console.error(`❌ Fallback SMTP (Port 587) also failed: ${fallbackError.message}`);
            throw fallbackError;
        }
    }
};

module.exports = {
    sendMail,
    getTransporter: () => primaryTransporter,
    transporter: primaryTransporter
};
