const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token (Format is "Bearer <token_string>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database by the ID inside the token
      // We use .select('-passwordHash') so we don't accidentally pass the password along
      req.user = await User.findById(decoded.id).select('-passwordHash');

      // 5. Move to the next function (the controller)
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
