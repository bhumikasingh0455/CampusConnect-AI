const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetAudience: {
      type: [String],
      enum: ['all', 'student', 'faculty', 'parent', 'admin'],
      default: ['all']
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },
    category: {
      type: String,
      enum: ['Academic', 'Examination', 'Event', 'Holiday', 'Placement', 'General'],
      default: 'General'
    },
    attachmentUrl: {
      type: String,
      default: ''
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

announcementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
