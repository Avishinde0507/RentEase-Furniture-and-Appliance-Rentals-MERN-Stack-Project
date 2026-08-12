const express = require('express');
const router = express.Router();
const { createRequest, getAllRequests, updateRequestStatus } = require('../controllers/maintenanceController');

router.post('/create', createRequest);
router.get('/all', getAllRequests);
router.put('/update-status', updateRequestStatus);

module.exports = router;
