const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // 1. Basic Validation
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // 2. Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with that email or username already exists' 
      });
    }

    // 3. Create the user (Password hashing happens automatically in the Model)
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      passwordHash: password, // Passing the plaintext password, the Model hook will hash it
    });

    // 4. Generate a JWT Token for immediate login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 5. Send success response (excluding the password hash)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during registration' });
  }
};

module.exports = { registerUser };
