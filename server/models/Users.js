const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
      firstName: { type: String, required: true, trim: true },
          lastName: { type: String, required: true, trim: true },
              username: { type: String, required: true, unique: true, trim: true, lowercase: true },
                  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
                      passwordHash: { type: String, required: true },
                          authProvider: { type: String, enum: ['CREDENTIALS', 'OAUTH'], default: 'CREDENTIALS' },
                            },
                              { timestamps: true }
                              );

                              // Modern async pre-save hook
                              UserSchema.pre('save', async function () {
                                // If the password hasn't been modified, skip hashing
                                  if (!this.isModified('passwordHash')) return;

                                    // Generate a secure salt and hash the plaintext password
                                      const salt = await bcrypt.genSalt(10);
                                        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
                                        });

                                        // Utility method to check passwords
                                        UserSchema.methods.comparePassword = async function (candidatePassword) {
                                          return await bcrypt.compare(candidatePassword, this.passwordHash);
                                          };

                                          module.exports = mongoose.model('User', UserSchema);
                                          