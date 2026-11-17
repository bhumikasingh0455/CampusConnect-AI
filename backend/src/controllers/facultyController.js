const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Timetable = require('../models/Timetable');
const StudentProfile = require('../models/StudentProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/faculty
// @desc    List all faculty members
// @access  Authenticated
const getFacultyList = async (req, res) => {
  try {
    const { department, search } = req.query;
    const filter = {};
    if (department) filter.department = department;

    const faculties = await FacultyProfile.find(filter)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('assignedSubjects', 'name code semester')
      .sort({ createdAt: -1 });

    let results = faculties;
    if (search) {
      const q = search.toLowerCase();
      results = faculties.filter(f =>
        f.user && (f.user.name.toLowerCase().includes(q) || f.user.email.toLowerCase().includes(q))
      );
    }

    return successResponse(res, { faculty: results });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/faculty/:id
// @desc    Get faculty profile by ID
// @access  Authenticated
const getFacultyById = async (req, res) => {
  try {
    const faculty = await FacultyProfile.findOne({
      $or: [{ _id: req.params.id }, { user: req.params.id }]
    })
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('assignedSubjects', 'name code semester credits');

    if (!faculty) {
      return errorResponse(res, 'Faculty profile not found', 404);
    }

    return successResponse(res, { faculty });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/faculty
// @desc    Create faculty member (Admin)
// @access  Admin
const createFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      employeeId,
      department,
      designation,
      qualification,
      specialization,
      officeRoom,
      assignedSubjects
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const existingEmp = await FacultyProfile.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingEmp) {
      return errorResponse(res, 'Employee ID already exists', 400);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'Campus@123',
      role: 'faculty',
      phone: phone || ''
    });

    const facultyProfile = await FacultyProfile.create({
      user: user._id,
      employeeId: employeeId.toUpperCase(),
      department,
      designation: designation || 'Assistant Professor',
      qualification: qualification || 'M.Tech / Ph.D',
      specialization: specialization || 'Computer Science',
      officeRoom: officeRoom || 'Faculty Block',
      assignedSubjects: assignedSubjects || []
    });

    // Also update assignedSubjects to set faculty field
    if (assignedSubjects && assignedSubjects.length > 0) {
      await Subject.updateMany(
        { _id: { $in: assignedSubjects } },
        { faculty: user._id }
      );
    }

    return successResponse(res, { user, profile: facultyProfile }, 'Faculty created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/faculty/:id
// @desc    Update faculty profile
// @access  Admin, Faculty (self)
const updateFaculty = async (req, res) => {
  try {
    const {
      name,
      phone,
      designation,
      qualification,
      specialization,
      officeRoom,
      assignedSubjects
    } = req.body;

    const profile = await FacultyProfile.findOne({
      $or: [{ _id: req.params.id }, { user: req.params.id }]
    });

    if (!profile) {
      return errorResponse(res, 'Faculty profile not found', 404);
    }

    if (req.user.role === 'faculty' && String(profile.user) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to edit another faculty profile', 403);
    }

    if (designation && req.user.role === 'admin') profile.designation = designation;
    if (qualification) profile.qualification = qualification;
    if (specialization) profile.specialization = specialization;
    if (officeRoom) profile.officeRoom = officeRoom;
    if (assignedSubjects && req.user.role === 'admin') {
      profile.assignedSubjects = assignedSubjects;
      await Subject.updateMany(
        { _id: { $in: assignedSubjects } },
        { faculty: profile.user }
      );
    }

    await profile.save();

    if (name || phone !== undefined) {
      const user = await User.findById(profile.user);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        await user.save();
      }
    }

    return successResponse(res, { profile }, 'Faculty profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/faculty/dashboard/overview
// @desc    Faculty dashboard stats & summary
// @access  Faculty
const getFacultyDashboardOverview = async (req, res) => {
  try {
    const facultyUserId = req.user._id;

    const profile = await FacultyProfile.findOne({ user: facultyUserId })
      .populate('department', 'name code')
      .populate('assignedSubjects', 'name code semester credits');

    if (!profile) {
      return errorResponse(res, 'Faculty profile not found', 404);
    }

    const assignedSubjectIds = profile.assignedSubjects.map(s => s._id);

    // 1. Total Enrolled Students across assigned subjects
    const totalStudentsInDept = await StudentProfile.countDocuments({
      department: profile.department._id
    });

    // 2. Active Assignments count & pending submissions to grade
    const assignments = await Assignment.find({ faculty: facultyUserId });
    const assignmentIds = assignments.map(a => a._id);

    const pendingSubmissionsCount = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
      status: 'submitted'
    });

    // 3. Today's classes
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[new Date().getDay()] || 'Monday';

    const todaysSchedule = await Timetable.find({
      faculty: facultyUserId,
      dayOfWeek: currentDay === 'Sunday' ? 'Monday' : currentDay
    })
      .populate('subject', 'name code')
      .populate('course', 'name code')
      .sort({ startTime: 1 });

    // 4. Class attendance averages
    const recentAttendance = await Attendance.aggregate([
      {
        $match: {
          faculty: facultyUserId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    let present = 0;
    let total = 0;
    recentAttendance.forEach(a => {
      total += a.count;
      if (a._id === 'present') present += a.count;
    });

    const averageAttendanceRate = total > 0 ? Math.round((present / total) * 100) : 86;

    return successResponse(res, {
      profile,
      metrics: {
        totalSubjectsAssigned: profile.assignedSubjects.length,
        totalStudentsEstimated: totalStudentsInDept,
        activeAssignmentsCount: assignments.length,
        pendingSubmissionsToGrade: pendingSubmissionsCount,
        averageAttendanceRate
      },
      todaysSchedule,
      assignedSubjects: profile.assignedSubjects
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getFacultyList,
  getFacultyById,
  createFaculty,
  updateFaculty,
  getFacultyDashboardOverview
};
