const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Authentication token required. Please sign in.', 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_prod'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'The user belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Please contact the administrator.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please sign in again.', 401);
    }
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
};

module.exports = authenticate;
