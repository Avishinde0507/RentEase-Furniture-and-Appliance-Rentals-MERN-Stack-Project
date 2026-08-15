const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Email Transporter (Same as authController)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Send Order Confirmation Email
// @route   POST /api/orders/send-confirmation
exports.sendOrderConfirmation = async (req, res) => {
    try {
        const { order, userEmail } = req.body;

        if (!userEmail) {
            return res.status(400).json({ message: 'User email is required' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Order Confirmed - ${order.id} | RentEase`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
                    <div style="background-color: #ff4d4d; padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Confirmed!</h1>
                        <p style="color: #ffeaea; margin-top: 10px;">Thank you for choosing RentEase</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px;">Hello ${order.user},</h2>
                        <p style="color: #475569; line-height: 1.6;">Your order <strong>${order.id}</strong> has been placed successfully. We are excited to help you upgrade your home!</p>
                        
                        <div style="background-color: #f8fafc; border-radius: 15px; padding: 20px; margin: 25px 0;">
                            <h3 style="color: #1e293b; font-size: 16px; margin-top: 0;">Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="color: #64748b; padding: 5px 0;">Products:</td>
                                    <td style="color: #1e293b; font-weight: bold; text-align: right; padding: 5px 0;">${order.product}</td>
                                </tr>
                                <tr>
                                    <td style="color: #64748b; padding: 5px 0;">Total Amount:</td>
                                    <td style="color: #ff4d4d; font-weight: bold; font-size: 18px; text-align: right; padding: 5px 0;">${order.amount}</td>
                                </tr>
                                <tr>
                                    <td style="color: #64748b; padding: 5px 0;">Address:</td>
                                    <td style="color: #1e293b; text-align: right; padding: 5px 0; font-size: 13px;">${order.address}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px;">
                            <p style="color: #92400e; margin: 0; font-weight: bold; font-size: 14px;">🚚 Estimated Delivery</p>
                            <p style="color: #b45309; margin: 5px 0 0; font-size: 13px;">Within 2-3 working days. Our team will contact you to coordinate the arrival.</p>
                        </div>

                        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 30px;">
                            <p style="color: #1e293b; font-weight: bold; margin-bottom: 5px;">Thank you for renting with us!</p>
                            <p style="color: #64748b; font-size: 14px;">Visit again for more premium products.</p>
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display: inline-block; background-color: #ff4d4d; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px;">Browse More</a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                        © 2026 RentEase Inc. | All rights reserved.
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order Confirmation Email sent to: ${userEmail}`);
        res.json({ success: true, message: 'Confirmation email sent successfully' });
    } catch (error) {
        console.error('Order Email Error:', error);
        res.status(500).json({ message: 'Failed to send order email' });
    }
};
// @desc    Create new order in MongoDB
// @route   POST /api/orders/create
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order({
            orderId: orderData.id,
            user: orderData.user,
            product: orderData.product,
            amount: orderData.amount,
            status: orderData.status || 'Pending',
            date: orderData.date,
            tenure: orderData.tenure,
            deliveryDate: orderData.deliveryDate,
            address: orderData.address,
            paymentMethod: orderData.paymentMethod,
            paymentId: orderData.paymentId,
            location: orderData.location,
            items: orderData.items
        });

        await newOrder.save();
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Failed to save order to database' });
    }
};

// @desc    Get all orders for Admin
// @route   GET /api/orders/all
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// @desc    Update Order Status
// @route   PUT /api/orders/update-status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { status: status },
            { new: true }
        );
        res.json({ success: true, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
