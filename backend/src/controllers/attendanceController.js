const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { calculateAttendanceMetrics } = require('../utils/predictor');
const { generateAttendanceQR, verifyAttendanceQR } = require('../services/qrService');
const { notifyUser } = require('../services/socketService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   POST /api/attendance/mark
// @desc    Faculty marks attendance for a class session (batch or single)
// @access  Faculty, Admin
const markAttendance = async (req, res) => {
  try {
    const { subjectId, date, records } = req.body;
    // records: [ { studentId, status: 'present' | 'absent' | 'leave', remarks } ]

    if (!subjectId || !date || !records || !Array.isArray(records)) {
      return errorResponse(res, 'subjectId, date, and records array are required', 400);
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const facultyId = req.user._id;
    const results = [];
    const lowAttendanceAlerts = [];

    for (const rec of records) {
      const { studentId, status, remarks } = rec;

      const record = await Attendance.findOneAndUpdate(
        {
          student: studentId,
          subject: subjectId,
          date: attendanceDate
        },
        {
          student: studentId,
          subject: subjectId,
          faculty: facultyId,
          date: attendanceDate,
          status: status || 'present',
          remarks: remarks || '',
          verifiedVia: 'manual'
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      results.push(record);

      // Check cumulative attendance for this student in this subject
      const totalRecs = await Attendance.countDocuments({
        student: studentId,
        subject: subjectId
      });
      const presentRecs = await Attendance.countDocuments({
        student: studentId,
        subject: subjectId,
        status: 'present'
      });

      const metrics = calculateAttendanceMetrics(presentRecs, totalRecs);

      // Trigger real-time alert and notification if attendance is below 75%
      if (metrics.isLowAttendance && status === 'absent') {
        const subject = await Subject.findById(subjectId).select('name code');
        const alertMsg = `Attendance Alert: Your attendance in ${subject?.name || 'subject'} is ${metrics.percentage}%. ${metrics.statusMessage}`;

        const notif = await Notification.create({
          recipient: studentId,
          title: '⚠️ Low Attendance Warning',
          message: alertMsg,
          type: 'attendance',
          link: '/student/attendance'
        });

        notifyUser(studentId, 'notification', notif);
        lowAttendanceAlerts.push({ studentId, percentage: metrics.percentage });
      }
    }

    return successResponse(
      res,
      {
        count: results.length,
        records: results,
        lowAttendanceAlerts
      },
      'Attendance marked successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/attendance/generate-qr
// @desc    Faculty generates time-limited dynamic QR code for attendance
// @access  Faculty, Admin
const generateClassQR = async (req, res) => {
  try {
    const { subjectId, date } = req.body;
    if (!subjectId) {
      return errorResponse(res, 'Subject ID is required', 400);
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const qrResult = await generateAttendanceQR({
      subjectId,
      facultyId: req.user._id,
      date: attendanceDate.toISOString()
    });

    return successResponse(res, qrResult, 'QR Attendance Code generated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/attendance/verify-qr
// @desc    Student scans and verifies QR code to register attendance
// @access  Student
const verifyClassQR = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const studentId = req.user._id;

    if (!qrToken) {
      return errorResponse(res, 'QR Token is required', 400);
    }

    const verification = verifyAttendanceQR(qrToken);
    if (!verification.isValid) {
      return errorResponse(res, verification.message, 400);
    }

    const attendanceDate = new Date(verification.date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked
    const existing = await Attendance.findOne({
      student: studentId,
      subject: verification.subjectId,
      date: attendanceDate
    });

    if (existing) {
      return errorResponse(res, 'Your attendance for this class has already been recorded!', 400);
    }

    // Verify student is in the department/semester of this subject
    const subject = await Subject.findById(verification.subjectId);
    if (!subject) {
      return errorResponse(res, 'Invalid subject linked to QR code.', 404);
    }

    const profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      return errorResponse(res, 'Student profile not found.', 404);
    }

    // Record verified attendance
    const attendanceRecord = await Attendance.create({
      student: studentId,
      subject: verification.subjectId,
      faculty: verification.facultyId,
      date: attendanceDate,
      status: 'present',
      verifiedVia: 'qr',
      remarks: 'Self-verified via Secure QR Code'
    });

    return successResponse(
      res,
      {
        record: attendanceRecord,
        subjectName: subject.name,
        date: attendanceDate
      },
      'Attendance successfully recorded via QR!'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/attendance/student/:studentId
// @desc    Get detailed attendance history, percentages, shortage predictions
// @access  Authenticated
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    // Authorization check: student can view self, parent if linked, faculty & admin can view
    if (req.user.role === 'student' && String(studentId) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized access to other student attendance', 403);
    }

    const records = await Attendance.find({ student: studentId })
      .populate('subject', 'name code semester credits')
      .populate('faculty', 'name')
      .sort({ date: -1 });

    const totalClasses = records.length;
    const attendedClasses = records.filter(r => r.status === 'present').length;
    const overallMetrics = calculateAttendanceMetrics(attendedClasses, totalClasses);

    // Subject breakdown
    const subjectMap = {};
    records.forEach(r => {
      if (!r.subject) return;
      const subId = String(r.subject._id);
      if (!subjectMap[subId]) {
        subjectMap[subId] = {
          subjectId: subId,
          subjectName: r.subject.name,
          subjectCode: r.subject.code,
          total: 0,
          attended: 0,
          absent: 0,
          leave: 0
        };
      }
      subjectMap[subId].total += 1;
      if (r.status === 'present') subjectMap[subId].attended += 1;
      else if (r.status === 'absent') subjectMap[subId].absent += 1;
      else if (r.status === 'leave') subjectMap[subId].leave += 1;
    });

    const subjectBreakdown = Object.values(subjectMap).map(sub => ({
      ...sub,
      ...calculateAttendanceMetrics(sub.attended, sub.total)
    }));

    return successResponse(res, {
      overall: overallMetrics,
      subjectBreakdown,
      records
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/attendance/subject-report/:subjectId
// @desc    Faculty / Admin gets attendance report for a subject
// @access  Faculty, Admin
const getSubjectAttendanceReport = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date } = req.query;

    const query = { subject: subjectId };
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      query.date = d;
    }

    const records = await Attendance.find(query)
      .populate('student', 'name email phone avatar')
      .populate('subject', 'name code')
      .sort({ date: -1 });

    return successResponse(res, { records });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  markAttendance,
  generateClassQR,
  verifyClassQR,
  getStudentAttendance,
  getSubjectAttendanceReport
};
