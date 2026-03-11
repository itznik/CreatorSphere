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

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate request
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check if password matches using our schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 5. Send success response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during login' });
  }
};

module.exports = { registerUser, loginUser };
