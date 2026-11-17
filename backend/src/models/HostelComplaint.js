const mongoose = require('mongoose');

const hostelComplaintSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: [
        'Electricity',
        'Water Supply',
        'Wi-Fi',
        'Room Cleaning',
        'Washroom',
        'Furniture',
        'Plumbing',
        'Security',
        'Mess/Food',
        'Other'
      ],
      required: [true, 'Complaint category is required']
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required']
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted'
    },
    assignedStaff: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      assignedAt: { type: Date, default: null }
    },
    resolutionNotes: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    studentRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    studentFeedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

hostelComplaintSchema.index({ hostel: 1, status: 1, priority: 1 });
hostelComplaintSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('HostelComplaint', hostelComplaintSchema);
