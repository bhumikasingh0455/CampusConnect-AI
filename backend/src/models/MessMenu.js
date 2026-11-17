const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    breakfast: {
      items: { type: [String], default: [] },
      timing: { type: String, default: '07:30 AM - 09:30 AM' }
    },
    lunch: {
      items: { type: [String], default: [] },
      timing: { type: String, default: '12:30 PM - 02:30 PM' }
    },
    snacks: {
      items: { type: [String], default: [] },
      timing: { type: String, default: '05:00 PM - 06:15 PM' }
    },
    dinner: {
      items: { type: [String], default: [] },
      timing: { type: String, default: '07:45 PM - 09:45 PM' }
    },
    isSpecial: {
      type: Boolean,
      default: false
    },
    specialNote: {
      type: String,
      default: ''
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

messMenuSchema.index({ hostel: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);
