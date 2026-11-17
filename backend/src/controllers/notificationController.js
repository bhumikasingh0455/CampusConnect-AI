const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/notifications
// @desc    Get user's notifications (persisted in MongoDB)
// @access  Authenticated
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    return successResponse(res, {
      notifications,
      unreadCount
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
// @access  Authenticated
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    return successResponse(res, { notification });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/notifications/read-all
// @desc    Mark all user's notifications as read
// @access  Authenticated
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    return successResponse(res, {}, 'All notifications marked as read');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
