const Platform = require('../models/Platform');

const connectPlatform = async (req, res) => {
  try {
    const { platformName, handle, platformId } = req.body;

    // We use req.user.id from our 'protect' middleware!
    const newPlatform = await Platform.create({
      user: req.user.id,
      platformName,
      handle,
      platformId
    });

    res.status(201).json({ success: true, platform: newPlatform });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Platform already connected' });
    }
    res.status(500).json({ success: false, message: 'Server Error connecting platform' });
  }
};

const getMyPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find({ user: req.user.id });
    res.status(200).json({ success: true, platforms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching platforms' });
  }
};

module.exports = { connectPlatform, getMyPlatforms };
