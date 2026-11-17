const mongoose = require('mongoose');

const hostelAnnouncementSchema = new mongoose.Schema(
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
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      default: null // null means broadcasts to all hostels
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    category: {
      type: String,
      enum: ['General', 'Maintenance', 'Water/Electricity', 'Mess', 'Events', 'Rules', 'Emergency'],
      default: 'General'
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

hostelAnnouncementSchema.index({ createdAt: -1 });
hostelAnnouncementSchema.index({ hostel: 1 });

module.exports = mongoose.model('HostelAnnouncement', hostelAnnouncementSchema);
