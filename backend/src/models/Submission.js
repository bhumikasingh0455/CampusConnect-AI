const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    fileUrl: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    isLate: {
      type: Boolean,
      default: false
    },
    marksObtained: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    gradedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmitted'],
      default: 'submitted'
    }
  },
  {
    timestamps: true
  }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
