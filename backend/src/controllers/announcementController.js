const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { broadcastEvent } = require('../services/socketService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/announcements
// @desc    Get announcements targeted to current user role or query
// @access  Authenticated
const getAnnouncements = async (req, res) => {
  try {
    const { category, priority, department } = req.query;
    const userRole = req.user.role;

    const query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (department) query.department = department;

    // Audience filtering: user can see 'all' + their own role
    if (userRole !== 'admin') {
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: userRole }
      ];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name email role avatar')
      .populate('department', 'name code')
      .sort({ isPinned: -1, createdAt: -1 });

    return successResponse(res, { announcements });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/announcements
// @desc    Create announcement (Admin, Faculty)
// @access  Admin, Faculty
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetAudience, priority, department, category, isPinned } = req.body;

    if (!title || !content) {
      return errorResponse(res, 'Title and content are required', 400);
    }

    let attachmentUrl = '';
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user._id,
      targetAudience: targetAudience ? (Array.isArray(targetAudience) ? targetAudience : [targetAudience]) : ['all'],
      priority: priority || 'normal',
      department: department || null,
      category: category || 'General',
      isPinned: isPinned || false,
      attachmentUrl
    });

    // Real-time broadcast
    broadcastEvent('announcement', announcement);

    return successResponse(res, { announcement }, 'Announcement created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Admin, Faculty author
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    if (req.user.role !== 'admin' && String(announcement.author) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to edit this announcement', 403);
    }

    const { title, content, targetAudience, priority, category, isPinned } = req.body;
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (targetAudience) announcement.targetAudience = Array.isArray(targetAudience) ? targetAudience : [targetAudience];
    if (priority) announcement.priority = priority;
    if (category) announcement.category = category;
    if (isPinned !== undefined) announcement.isPinned = isPinned;

    if (req.file) {
      announcement.attachmentUrl = `/uploads/${req.file.filename}`;
    }

    await announcement.save();
    return successResponse(res, { announcement }, 'Announcement updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Admin, Faculty author
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    if (req.user.role !== 'admin' && String(announcement.author) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to delete this announcement', 403);
    }

    await Announcement.findByIdAndDelete(req.params.id);
    return successResponse(res, {}, 'Announcement deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
