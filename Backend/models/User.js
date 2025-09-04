const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Make password optional for OAuth users
  googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
  avatar: { type: String }, // Profile picture URL
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

