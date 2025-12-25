const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.sendRequest);
router.get('/owner', requestController.getOwnerRequests);
router.put('/status', requestController.updateRequestStatus);

module.exports = router;
