const mongoose = require('mongoose');

const hostelBlockSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Hostel reference is required']
    },
    name: {
      type: String,
      required: [true, 'Block name is required'],
      trim: true
    },
    blockName: {
      type: String,
      trim: true
    },
    code: {
      type: String,
      uppercase: true,
      trim: true,
      default: function () {
        return (this.name || this.blockName || 'BLK').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
      }
    },
    totalFloors: {
      type: Number,
      default: 4
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

hostelBlockSchema.index({ hostel: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('HostelBlock', hostelBlockSchema);
