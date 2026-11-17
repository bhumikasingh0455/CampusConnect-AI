const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const FacultyProfile = require('../models/FacultyProfile');
const ParentStudentLink = require('../models/ParentStudentLink');
const { generateToken } = require('../utils/token');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { logAction } = require('../services/auditService');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, `No account registered with '${email}'. Please register first or use an existing demo account.`, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Incorrect password. Please verify your password and try again.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account is deactivated. Contact administrator.', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    // Fetch related profile if student, faculty, or parent
    let profileData = null;
    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('course', 'name code');
    } else if (user.role === 'faculty') {
      profileData = await FacultyProfile.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('assignedSubjects', 'name code semester');
    } else if (user.role === 'parent') {
      profileData = await ParentStudentLink.find({ parent: user._id })
        .populate({
          path: 'student',
          select: 'name email phone avatar'
        });
    }

    await logAction({
      action: 'USER_LOGIN',
      performedBy: user._id,
      targetResource: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role },
      req
    });

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          profile: profileData
        }
      },
      'Login successful'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/auth/register
// @desc    Self register for demo / testing
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      phone: phone || ''
    });

    const token = generateToken(user);

    await logAction({
      action: 'USER_REGISTER',
      performedBy: user._id,
      targetResource: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role },
      req
    });

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar
        }
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    let profileData = null;
    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('course', 'name code');
    } else if (user.role === 'faculty') {
      profileData = await FacultyProfile.findOne({ user: user._id })
        .populate('department', 'name code')
        .populate('assignedSubjects', 'name code semester');
    } else if (user.role === 'parent') {
      profileData = await ParentStudentLink.find({ parent: user._id })
        .populate({
          path: 'student',
          select: 'name email phone avatar'
        });
    }

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt,
          profile: profileData
        }
      },
      'User profile fetched'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update basic user profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters', 400);
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    await logAction({
      action: 'PASSWORD_CHANGED',
      performedBy: user._id,
      targetResource: 'User',
      resourceId: user._id,
      req
    });

    return successResponse(res, {}, 'Password changed successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  login,
  register,
  getMe,
  updateProfile,
  changePassword
};
