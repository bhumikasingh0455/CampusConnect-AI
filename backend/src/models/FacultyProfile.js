const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    designation: {
      type: String,
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Head of Department'],
      default: 'Assistant Professor'
    },
    qualification: {
      type: String,
      default: 'Ph.D in Computer Science'
    },
    specialization: {
      type: String,
      default: 'Artificial Intelligence & Machine Learning'
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    officeRoom: {
      type: String,
      default: 'Faculty Block B - 302'
    },
    assignedSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
