const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_prod',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_prod'
  );
};

module.exports = {
  generateToken,
  verifyToken
};
