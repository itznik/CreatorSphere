const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platformName: {
    type: String,
    required: true,
    enum: ['INSTAGRAM', 'YOUTUBE', 'X', 'TIKTOK']
  },
  handle: {
    type: String,
    required: true,
    trim: true
  },
  platformId: { 
    type: String, // The unique ID from the external API (e.g., YouTube Channel ID)
    required: true 
  },
  followerCount: {
    type: Number,
    default: 0
  },
  accessToken: { type: String }, // For future OAuth integrations
  refreshToken: { type: String },
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate platform connections for the same user
PlatformSchema.index({ user: 1, platformName: 1, handle: 1 }, { unique: true });

module.exports = mongoose.model('Platform', PlatformSchema);
