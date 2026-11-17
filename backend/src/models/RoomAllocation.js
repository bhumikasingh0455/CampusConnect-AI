const mongoose = require('mongoose');

const roomAllocationSchema = new mongoose.Schema(
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
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelBlock',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelRoom',
      required: true
    },
    bedNumber: {
      type: Number,
      required: true,
      default: 1
    },
    academicYear: {
      type: String,
      default: '2024-2025'
    },
    allocatedDate: {
      type: Date,
      default: Date.now
    },
    vacatedDate: {
      type: Date,
      default: null
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['Active', 'Vacated', 'Transfer_Requested'],
      default: 'Active'
    },
    transferRequest: {
      requestedRoomType: { type: String, default: '' },
      reason: { type: String, default: '' },
      requestDate: { type: Date, default: null },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'None'], default: 'None' },
      reviewRemarks: { type: String, default: '' }
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

// Prevent same student from having multiple simultaneous Active allocations
roomAllocationSchema.index({ student: 1, status: 1 });
roomAllocationSchema.index({ room: 1, bedNumber: 1, status: 1 });

module.exports = mongoose.model('RoomAllocation', roomAllocationSchema);
