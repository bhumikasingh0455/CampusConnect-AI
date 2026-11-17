const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    academicYear: {
      type: String,
      default: '2024-2025'
    },
    examType: {
      type: String,
      enum: ['Internal 1', 'Internal 2', 'Midterm', 'Assignment', 'Practical', 'End Semester'],
      required: true
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100
    },
    gradeLetter: {
      type: String,
      enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'],
      default: 'A'
    },
    gradePoint: {
      type: Number,
      default: 8
    },
    remarks: {
      type: String,
      default: ''
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

gradeSchema.index({ student: 1, subject: 1, examType: 1, semester: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
