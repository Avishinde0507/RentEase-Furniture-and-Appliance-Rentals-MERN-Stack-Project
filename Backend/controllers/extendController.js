const ExtendRequest = require('../models/ExtendRequest');
const Order = require('../models/Order');

// @desc    Create extension request
// @route   POST /api/extend/create
exports.createExtendRequest = async (req, res) => {
    try {
        const { orderId, user, product, currentTenure, requestedTenure, amount, paymentId } = req.body;
        
        const newRequest = new ExtendRequest({
            orderId,
            user,
            product,
            currentTenure,
            requestedTenure,
            amount,
            paymentId
        });

        await newRequest.save();
        res.status(201).json({ success: true, request: newRequest });
    } catch (error) {
        console.error('Create Extend Request Error:', error);
        res.status(500).json({ message: 'Failed to create extension request' });
    }
};

// @desc    Get all extension requests
// @route   GET /api/extend/all
exports.getAllExtendRequests = async (req, res) => {
    try {
        const requests = await ExtendRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch extension requests' });
    }
};

// @desc    Update extension request status (Approve/Reject)
// @route   PUT /api/extend/update-status
exports.updateExtendStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const request = await ExtendRequest.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        await request.save();

        if (status === 'Approved') {
            // Update the order tenure as well
            await Order.findOneAndUpdate(
                { orderId: request.orderId },
                { 
                    tenure: request.requestedTenure,
                    extensionTenure: request.currentTenure 
                }
            );
        }

        res.json({ success: true, request });
    } catch (error) {
        console.error('Update Extend Status Error:', error);
        res.status(500).json({ message: 'Failed to update request status' });
    }
};
