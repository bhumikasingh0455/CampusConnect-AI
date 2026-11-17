const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    section: {
      type: String,
      default: 'A'
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String, // e.g. "09:00"
      required: true
    },
    endTime: {
      type: String, // e.g. "10:00"
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    roomNumber: {
      type: String,
      default: 'Hall 101'
    }
  },
  {
    timestamps: true
  }
);

timetableSchema.index({ department: 1, course: 1, semester: 1, section: 1, dayOfWeek: 1, startTime: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
