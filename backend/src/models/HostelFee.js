const mongoose = require('mongoose');

const paymentRecordSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Online Gateway', 'UPI', 'Debit/Credit Card', 'Net Banking', 'Cash/Demand Draft'],
    default: 'Online Gateway'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  receiptNumber: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  }
});

const hostelFeeSchema = new mongoose.Schema(
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
    roomAllocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomAllocation',
      required: true
    },
    academicYear: {
      type: String,
      default: '2024-2025'
    },
    term: {
      type: String,
      enum: ['Semester 1', 'Semester 2', 'Annual'],
      default: 'Semester 1'
    },
    roomCharges: {
      type: Number,
      required: true,
      default: 24000
    },
    messCharges: {
      type: Number,
      required: true,
      default: 18000
    },
    securityDeposit: {
      type: Number,
      default: 5000
    },
    maintenanceCharges: {
      type: Number,
      default: 2000
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    outstandingAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue', 'Partially Paid'],
      default: 'Pending'
    },
    dueDate: {
      type: Date,
      required: true
    },
    payments: [paymentRecordSchema]
  },
  {
    timestamps: true
  }
);

hostelFeeSchema.index({ student: 1, term: 1, academicYear: 1 });
hostelFeeSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('HostelFee', hostelFeeSchema);
