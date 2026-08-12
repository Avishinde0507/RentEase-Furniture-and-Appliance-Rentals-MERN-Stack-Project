const Maintenance = require('../models/Maintenance');

// @desc    Create new maintenance request
// @route   POST /api/maintenance/create
exports.createRequest = async (req, res) => {
    try {
        const reqData = req.body;
        const newRequest = new Maintenance({
            requestId: reqData.id,
            userId: reqData.userId,
            userName: reqData.userName,
            product: reqData.product,
            issue: reqData.issue,
            type: reqData.type,
            status: reqData.status || 'Pending',
            date: reqData.date,
            visitDate: reqData.visitDate
        });

        await newRequest.save();
        res.status(201).json({ success: true, request: newRequest });
    } catch (error) {
        console.error('Maintenance Error:', error);
        res.status(500).json({ message: 'Failed to submit maintenance request' });
    }
};

// @desc    Get all requests for Admin
// @route   GET /api/maintenance/all
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Maintenance.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch maintenance requests' });
    }
};

// @desc    Update Request Status
// @route   PUT /api/maintenance/update-status
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        // Search by requestId OR internal MongoDB _id
        const updatedRequest = await Maintenance.findOneAndUpdate(
            { $or: [{ requestId: requestId }, { _id: requestId }] },
            { status: status },
            { new: true }
        );
        res.json({ success: true, request: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update request status' });
    }
};
