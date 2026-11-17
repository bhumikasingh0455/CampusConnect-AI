const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required']
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    maxMarks: {
      type: Number,
      default: 100
    },
    attachment: {
      url: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'closed'],
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

assignmentSchema.index({ subject: 1, dueDate: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
