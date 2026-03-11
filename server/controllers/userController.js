const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private (Requires JWT in HttpOnly Cookie)
const getUserProfile = async (req, res) => {
  try {
    // 1. req.user is already populated by our 'protect' middleware
    // We fetch a fresh copy from DB to ensure we have latest data
    const user = await User.findById(req.user._id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // 2. Return the user data to the frontend
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile' 
    });
  }
};

// @desc    Update user profile (Placeholder for future feature)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  // Logic for updating names or usernames can go here later
  res.status(200).json({ message: "Update profile endpoint ready" });
};

module.exports = { 
  getUserProfile,
  updateUserProfile 
};
