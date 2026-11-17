const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required']
    },
    durationYears: {
      type: Number,
      default: 4
    },
    totalSemesters: {
      type: Number,
      default: 8
    },
    degreeType: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate'],
      default: 'Undergraduate'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
