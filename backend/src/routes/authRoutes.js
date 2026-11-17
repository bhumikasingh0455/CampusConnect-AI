const express = require('express');
const router = express.Router();
const { login, register, getMe, updateProfile, changePassword } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);
router.get('/me', authenticate, getMe);
router.put('/update-profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
