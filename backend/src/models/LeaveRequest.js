const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'faculty'],
      required: true
    },
    leaveType: {
      type: String,
      enum: ['Medical', 'Casual', 'Academic', 'Duty', 'Emergency'],
      default: 'Casual'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason is required']
    },
    documentUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewRemarks: {
      type: String,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

leaveRequestSchema.index({ applicant: 1, status: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
