const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Helper function to generate token and configure the secure cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const cookieOptions = {
    httpOnly: true, // Invisible to JavaScript (XSS Protection)
    secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
    sameSite: 'strict', // CSRF Protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('jwt', token, cookieOptions);
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ firstName, lastName, username, email, passwordHash: password });

    // Set the secure cookie instead of sending the token in JSON
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Set the secure cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during login' });
  }
};

module.exports = { registerUser, loginUser };
