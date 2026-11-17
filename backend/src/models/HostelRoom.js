const mongoose = require('mongoose');

const hostelRoomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelBlock',
      required: true
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      default: 1
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      default: 'Double'
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 2
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: 0
    },
    monthlyRent: {
      type: Number,
      default: 4500
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Attached Washroom', 'Study Desk', 'Ergonomic Chair', 'Wardrobe']
    },
    status: {
      type: String,
      enum: ['Available', 'Full', 'Maintenance'],
      default: 'Available'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

hostelRoomSchema.virtual('availableBeds').get(function () {
  return Math.max(0, this.capacity - (this.occupiedBeds || 0));
});

hostelRoomSchema.index({ hostel: 1, block: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('HostelRoom', hostelRoomSchema);
