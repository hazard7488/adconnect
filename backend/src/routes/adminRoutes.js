const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(auth);
router.use(adminOnly);

router.get('/users', adminController.getUsers);
router.get('/properties', adminController.getProperties);
router.post('/feature', adminController.featureProperty);
router.get('/requests', adminController.getRequests);
router.get('/payments', adminController.getPayments);

module.exports = router;
