const mongoose = require('mongoose');

const hostelLeaveRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelRoom',
      required: true
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date and time is required']
    },
    expectedReturnDate: {
      type: Date,
      required: [true, 'Expected return date and time is required']
    },
    actualReturnDate: {
      type: Date,
      default: null
    },
    destination: {
      type: String,
      required: [true, 'Destination address or city is required'],
      trim: true
    },
    reason: {
      type: String,
      required: [true, 'Reason for leave is required'],
      trim: true
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' }
    },
    parentConsentConfirmed: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Returned'],
      default: 'Pending'
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
    },
    isOverdue: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

hostelLeaveRequestSchema.index({ student: 1, status: 1 });
hostelLeaveRequestSchema.index({ hostel: 1, status: 1, expectedReturnDate: 1 });

module.exports = mongoose.model('HostelLeaveRequest', hostelLeaveRequestSchema);
