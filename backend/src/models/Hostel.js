const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hostel name is required'],
      trim: true,
      unique: true
    },
    code: {
      type: String,
      required: [true, 'Hostel code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-ed'],
      required: true,
      default: 'Boys'
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Main University Campus'
    },
    contactNumber: {
      type: String,
      default: ''
    },
    wardens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    chiefWarden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    totalRooms: {
      type: Number,
      default: 0
    },
    totalCapacity: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Hostel', hostelSchema);
