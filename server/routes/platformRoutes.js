const express = require('express');
const router = express.Router();
const { connectPlatform, getMyPlatforms } = require('../controllers/platformController');
const { protect } = require('../middleware/authMiddleware');

router.post('/connect', protect, connectPlatform);
router.get('/', protect, getMyPlatforms);

module.exports = router;

