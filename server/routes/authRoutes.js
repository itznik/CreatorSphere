const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// Map the POST request to the registerUser function
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
