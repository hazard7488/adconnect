const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, propertyController.addProperty);
router.get('/', auth, propertyController.getAllProperties);
router.post('/view/:id', auth, propertyController.incrementView);

module.exports = router;
