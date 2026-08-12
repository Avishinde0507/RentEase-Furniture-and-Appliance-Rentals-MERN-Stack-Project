const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Send contact form message to support email and confirmation to sender
// @route   POST /api/contact/send
exports.sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
        }

        const adminEmail = 'renteasefurniturerentals@gmail.com';
        const mailSubject = subject && subject.trim() ? subject : 'New Customer Inquiry';

        // 1. Mail to Admin / Support
        const adminMailOptions = {
            from: `"RentEase Contact Form" <${process.env.EMAIL_USER}>`,
            to: [adminEmail, process.env.EMAIL_USER],
            replyTo: email,
            subject: `📩 Contact Form Submission: ${mailSubject} (from ${name})`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; rounded: 10px;">
                    <h2 style="color: #e53e3e; margin-bottom: 20px;">New Message Received via RentEase Website</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Sender Name:</td>
                            <td style="padding: 8px 0;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Sender Email:</td>
                            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                            <td style="padding: 8px 0;">${mailSubject}</td>
                        </tr>
                    </table>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <h4 style="margin-bottom: 10px;">Message:</h4>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
            `
        };

        // 2. Auto-Acknowledgement Mail to Customer
        const userMailOptions = {
            from: `"RentEase Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thank you for reaching out to RentEase!`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #e53e3e;">Hello ${name},</h2>
                    <p>Thank you for contacting <strong>RentEase</strong>! We have received your message regarding "<strong>${mailSubject}</strong>".</p>
                    <p>Our customer support team is reviewing your inquiry and will respond to you within 2-4 hours during business hours.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <h4 style="margin-bottom: 10px; color: #555;">Summary of your message:</h4>
                    <p style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-style: italic; color: #555;">"${message}"</p>
                    <br/>
                    <p>Warm regards,</p>
                    <p><strong>RentEase Support Team</strong><br/>Email: renteasefurniturerentals@gmail.com<br/>Phone: +91 9518386406</p>
                </div>
            `
        };

        // Send emails asynchronously
        await transporter.sendMail(adminMailOptions);
        
        // Attempt confirmation email to customer (catch silently if invalid customer email format)
        transporter.sendMail(userMailOptions).catch(err => {
            console.warn('Customer auto-reply failed:', err.message);
        });

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you shortly.'
        });

    } catch (error) {
        console.error('❌ Error sending contact email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later or email us directly at renteasefurniturerentals@gmail.com.'
        });
    }
};
