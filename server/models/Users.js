const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    // We will use this later when we add Google/X login
    authProvider: { type: String, enum: ['CREDENTIALS', 'OAUTH'], default: 'CREDENTIALS' },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Modern Pre-save hook (No 'next' callback needed)
UserSchema.pre('save', async function () {
  // If the password hasn't been modified, skip hashing
  if (!this.isModified('passwordHash')) return;

  // Generate a secure salt and hash the plaintext password
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});


  try {
    // Generate a secure salt and hash the plaintext password
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Utility method to check passwords when the user logs in later
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
