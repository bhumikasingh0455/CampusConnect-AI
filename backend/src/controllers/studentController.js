const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Grade = require('../models/Grade');
const Timetable = require('../models/Timetable');
const Announcement = require('../models/Announcement');
const Subject = require('../models/Subject');
const { calculateAttendanceMetrics } = require('../utils/predictor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/students
// @desc    List all students with profile info (Admin / Faculty)
// @access  Admin, Faculty
const getStudents = async (req, res) => {
  try {
    const { department, semester, search } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (semester) filter.currentSemester = Number(semester);

    const profiles = await StudentProfile.find(filter)
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ rollNumber: 1 });

    // Filter by search term on user name/email if provided
    let results = profiles;
    if (search) {
      const q = search.toLowerCase();
      results = profiles.filter(p =>
        (p.user && (p.user.name.toLowerCase().includes(q) || p.user.email.toLowerCase().includes(q))) ||
        p.rollNumber.toLowerCase().includes(q) ||
        p.enrollmentNumber.toLowerCase().includes(q)
      );
    }

    return successResponse(res, { students: results });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/students/:id
// @desc    Get student profile by ID
// @access  Authenticated
const getStudentById = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({
      $or: [{ _id: req.params.id }, { user: req.params.id }]
    })
      .populate('user', 'name email phone avatar isActive')
      .populate('department', 'name code')
      .populate('course', 'name code');

    if (!student) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    return successResponse(res, { student });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/students
// @desc    Create student with User and StudentProfile (Admin)
// @access  Admin
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      enrollmentNumber,
      rollNumber,
      department,
      course,
      currentSemester,
      section,
      batchYear,
      gender,
      guardianContact,
      address
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const existingRoll = await StudentProfile.findOne({ enrollmentNumber: enrollmentNumber.toUpperCase() });
    if (existingRoll) {
      return errorResponse(res, 'Enrollment number already exists', 400);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'Campus@123',
      role: 'student',
      phone: phone || ''
    });

    const studentProfile = await StudentProfile.create({
      user: user._id,
      enrollmentNumber: enrollmentNumber.toUpperCase(),
      rollNumber,
      department,
      course,
      currentSemester: currentSemester || 1,
      section: section || 'A',
      batchYear: batchYear || '2023-2027',
      gender: gender || 'Male',
      guardianContact: guardianContact || {},
      address: address || {}
    });

    return successResponse(res, { user, profile: studentProfile }, 'Student created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/students/:id
// @desc    Update student profile
// @access  Admin, Faculty, Student (self)
const updateStudent = async (req, res) => {
  try {
    const {
      name,
      phone,
      rollNumber,
      currentSemester,
      section,
      guardianContact,
      address,
      academicStatus
    } = req.body;

    const profile = await StudentProfile.findOne({
      $or: [{ _id: req.params.id }, { user: req.params.id }]
    });

    if (!profile) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    // Role check: Student can only edit self, Admin/Faculty can edit
    if (req.user.role === 'student' && String(profile.user) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to edit another student profile', 403);
    }

    if (rollNumber) profile.rollNumber = rollNumber;
    if (currentSemester) profile.currentSemester = currentSemester;
    if (section) profile.section = section;
    if (guardianContact) profile.guardianContact = { ...profile.guardianContact, ...guardianContact };
    if (address) profile.address = { ...profile.address, ...address };
    if (academicStatus && req.user.role === 'admin') profile.academicStatus = academicStatus;

    await profile.save();

    if (name || phone !== undefined) {
      const user = await User.findById(profile.user);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        await user.save();
      }
    }

    return successResponse(res, { profile }, 'Student profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/students/dashboard/overview
// @desc    Get full analytical overview for the logged-in student dashboard
// @access  Student
const getStudentDashboardOverview = async (req, res) => {
  try {
    const studentUserId = req.user._id;

    const profile = await StudentProfile.findOne({ user: studentUserId })
      .populate('department', 'name code')
      .populate('course', 'name code');

    if (!profile) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    // 1. Attendance Metrics
    const allAttendanceRecords = await Attendance.find({ student: studentUserId })
      .populate('subject', 'name code');

    const totalClasses = allAttendanceRecords.length;
    const attendedClasses = allAttendanceRecords.filter(a => a.status === 'present').length;
    const overallAttendance = calculateAttendanceMetrics(attendedClasses, totalClasses);

    // Subject-wise attendance calculation
    const subjectAttendanceMap = {};
    allAttendanceRecords.forEach(rec => {
      if (!rec.subject) return;
      const subId = String(rec.subject._id);
      if (!subjectAttendanceMap[subId]) {
        subjectAttendanceMap[subId] = {
          subjectId: subId,
          subjectName: rec.subject.name,
          subjectCode: rec.subject.code,
          total: 0,
          attended: 0
        };
      }
      subjectAttendanceMap[subId].total += 1;
      if (rec.status === 'present') {
        subjectAttendanceMap[subId].attended += 1;
      }
    });

    const subjectAttendanceList = Object.values(subjectAttendanceMap).map(sub => {
      const metrics = calculateAttendanceMetrics(sub.attended, sub.total);
      return {
        ...sub,
        ...metrics
      };
    });

    // 2. Upcoming Timetable (Today's classes)
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[new Date().getDay()] || 'Monday';

    const todaysClasses = await Timetable.find({
      department: profile.department._id,
      course: profile.course._id,
      semester: profile.currentSemester,
      dayOfWeek: currentDay === 'Sunday' ? 'Monday' : currentDay
    })
      .populate('subject', 'name code')
      .populate('faculty', 'name email avatar')
      .sort({ startTime: 1 });

    // 3. Pending Assignments
    const now = new Date();
    const enrolledSubjects = await Subject.find({
      course: profile.course._id,
      semester: profile.currentSemester
    }).select('_id');

    const subjectIds = enrolledSubjects.map(s => s._id);

    const assignments = await Assignment.find({
      subject: { $in: subjectIds },
      status: 'published'
    })
      .populate('subject', 'name code')
      .populate('faculty', 'name')
      .sort({ dueDate: 1 });

    const studentSubmissions = await Submission.find({
      student: studentUserId
    });

    const submittedAssignmentIds = new Set(studentSubmissions.map(s => String(s.assignment)));

    const pendingAssignments = assignments
      .filter(a => !submittedAssignmentIds.has(String(a._id)))
      .map(a => ({
        _id: a._id,
        title: a.title,
        subject: a.subject,
        dueDate: a.dueDate,
        isOverdue: new Date(a.dueDate) < now,
        maxMarks: a.maxMarks
      }));

    // 4. Grades & Performance Analytics
    const grades = await Grade.find({ student: studentUserId })
      .populate('subject', 'name code credits')
      .sort({ createdAt: -1 });

    // Calculate approximate CGPA / SGPA
    let totalCredits = 0;
    let earnedGradePoints = 0;
    grades.forEach(g => {
      const credits = g.subject?.credits || 4;
      totalCredits += credits;
      earnedGradePoints += (g.gradePoint || 8) * credits;
    });

    const calculatedCGPA = totalCredits > 0
      ? Math.round((earnedGradePoints / totalCredits) * 100) / 100
      : 8.42;

    // 5. Recent College Announcements
    const announcements = await Announcement.find({
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'student' }
      ]
    })
      .populate('author', 'name role')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(5);

    return successResponse(res, {
      profile,
      overallAttendance,
      subjectAttendance: subjectAttendanceList,
      todaysClasses,
      pendingAssignments,
      academicPerformance: {
        cgpa: calculatedCGPA,
        totalSubjectsCount: subjectIds.length,
        completedSubmissionsCount: studentSubmissions.length,
        gradesCount: grades.length,
        gradesList: grades.slice(0, 5)
      },
      announcements
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  getStudentDashboardOverview
};
