const mongoose = require('mongoose');

const parentStudentLinkSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relationship: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian'],
      default: 'Father'
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

parentStudentLinkSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('ParentStudentLink', parentStudentLinkSchema);
