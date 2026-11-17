const mongoose = require('mongoose');

const hostelGateLogSchema = new mongoose.Schema(
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
      default: null
    },
    movementType: {
      type: String,
      enum: ['Check-Out', 'Check-In'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    destination: {
      type: String,
      default: 'Campus / Local Market'
    },
    reason: {
      type: String,
      default: 'General Outing'
    },
    isLateEntry: {
      type: Boolean,
      default: false
    },
    hasApprovedLeave: {
      type: Boolean,
      default: false
    },
    leaveReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelLeaveRequest',
      default: null
    },
    passToken: {
      type: String,
      default: ''
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

hostelGateLogSchema.index({ student: 1, timestamp: -1 });
hostelGateLogSchema.index({ hostel: 1, timestamp: -1, isLateEntry: 1 });

module.exports = mongoose.model('HostelGateLog', hostelGateLogSchema);
