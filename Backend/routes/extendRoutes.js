const express = require('express');
const router = express.Router();
const { createExtendRequest, getAllExtendRequests, updateExtendStatus } = require('../controllers/extendController');

router.post('/create', createExtendRequest);
router.get('/all', getAllExtendRequests);
router.put('/update-status', updateExtendStatus);

module.exports = router;
