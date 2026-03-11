const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This will help us debug in the terminal
console.log("🛠️  DEBUG: userRoutes.js is being parsed by Node");

router.get('/me', protect, getUserProfile);

module.exports = router;
