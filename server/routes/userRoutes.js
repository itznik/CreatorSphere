const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import the bouncer

// We drop the "protect" middleware right into the route definition
router.get('/me', protect, getUserProfile);

module.exports = router;
