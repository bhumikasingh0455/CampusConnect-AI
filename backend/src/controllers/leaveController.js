const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');
const { notifyUser } = require('../services/socketService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   POST /api/leaves
// @desc    Apply for leave (Student or Faculty)
// @access  Authenticated
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return errorResponse(res, 'Start date, end date, and reason are required', 400);
    }

    let documentUrl = '';
    if (req.file) {
      documentUrl = `/uploads/${req.file.filename}`;
    }

    const leave = await LeaveRequest.create({
      applicant: req.user._id,
      role: req.user.role,
      leaveType: leaveType || 'Casual',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      documentUrl,
      status: 'pending'
    });

    return successResponse(res, { leave }, 'Leave request submitted successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/leaves/my-leaves
// @desc    Get logged in user's leave history
// @access  Authenticated
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ applicant: req.user._id })
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    return successResponse(res, { leaves });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/leaves
// @desc    Get all leave applications (Faculty/Admin review)
// @access  Faculty, Admin
const getAllLeaves = async (req, res) => {
  try {
    const { status, role } = req.query;
    const query = {};

    if (status) query.status = status;
    if (role) query.role = role;

    // Faculty reviews student leaves; Admin reviews all
    if (req.user.role === 'faculty') {
      query.role = 'student';
    }

    const leaves = await LeaveRequest.find(query)
      .populate('applicant', 'name email phone avatar role')
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    return successResponse(res, { leaves });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/leaves/:id/review
// @desc    Approve or reject leave request
// @access  Faculty, Admin
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewRemarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, 'Status must be approved or rejected', 400);
    }

    const leave = await LeaveRequest.findById(req.params.id).populate('applicant', 'name');
    if (!leave) {
      return errorResponse(res, 'Leave request not found', 404);
    }

    leave.status = status;
    leave.reviewRemarks = reviewRemarks || '';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();

    await leave.save();

    // Notify applicant
    const notif = await Notification.create({
      recipient: leave.applicant._id,
      title: status === 'approved' ? '✅ Leave Request Approved' : '❌ Leave Request Rejected',
      message: `Your leave application from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status}. Remarks: ${reviewRemarks || 'None'}`,
      type: 'leave',
      link: '/student/leave'
    });
    notifyUser(leave.applicant._id, 'notification', notif);

    return successResponse(res, { leave }, `Leave request ${status} successfully`);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave
};
