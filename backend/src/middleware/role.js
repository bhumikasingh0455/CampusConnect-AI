const { errorResponse } = require('../utils/apiResponse');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before checking authorization.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Your role (${req.user.role}) is not authorized to access this resource.`,
        403
      );
    }

    next();
  };
};

module.exports = authorize;
