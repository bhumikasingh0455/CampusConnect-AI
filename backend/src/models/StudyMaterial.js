const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
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
    category: {
      type: String,
      enum: ['Lecture Notes', 'Reference Book', 'Lab Manual', 'Question Bank', 'Presentation', 'Code Sample'],
      default: 'Lecture Notes'
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: String,
      default: '1.2 MB'
    },
    summary: {
      type: String,
      default: ''
    },
    downloadsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

studyMaterialSchema.index({ subject: 1, semester: 1 });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
