// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private (Requires Token)
const getUserProfile = async (req, res) => {
  // Because our middleware ran first, req.user already contains the database info!
  if (req.user) {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        email: req.user.email,
        subscriptionTier: req.user.subscriptionTier,
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

module.exports = { getUserProfile };
