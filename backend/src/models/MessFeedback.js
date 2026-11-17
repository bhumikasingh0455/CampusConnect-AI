const mongoose = require('mongoose');

const messFeedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    hygieneRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4
    },
    foodQualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4
    },
    comments: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

messFeedbackSchema.index({ hostel: 1, date: -1 });

module.exports = mongoose.model('MessFeedback', messFeedbackSchema);
