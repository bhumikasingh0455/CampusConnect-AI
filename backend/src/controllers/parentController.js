const ParentStudentLink = require('../models/ParentStudentLink');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Announcement = require('../models/Announcement');
const Subject = require('../models/Subject');
const { calculateAttendanceMetrics } = require('../utils/predictor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/parents/students
// @desc    Get all students explicitly linked to the logged-in parent
// @access  Parent
const getLinkedStudents = async (req, res) => {
  try {
    const parentUserId = req.user._id;

    const links = await ParentStudentLink.find({ parent: parentUserId, verified: true })
      .populate('student', 'name email phone avatar');

    const studentIds = links.map(l => l.student._id);

    const profiles = await StudentProfile.find({ user: { $in: studentIds } })
      .populate('department', 'name code')
      .populate('course', 'name code');

    const profileMap = {};
    profiles.forEach(p => {
      profileMap[String(p.user)] = p;
    });

    const results = links.map(link => ({
      linkId: link._id,
      relationship: link.relationship,
      student: link.student,
      profile: profileMap[String(link.student._id)] || null
    }));

    return successResponse(res, { linkedStudents: results });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/parents/student-overview/:studentId
// @desc    Get full analytical overview for a specific linked student (Strict ownership check!)
// @access  Parent
const getStudentOverviewForParent = async (req, res) => {
  try {
    const parentUserId = req.user._id;
    const { studentId } = req.params;

    // Strict Ownership Check: Ensure parent is authorized to view this student
    const link = await ParentStudentLink.findOne({
      parent: parentUserId,
      student: studentId,
      verified: true
    });

    if (!link && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied. You are not linked or authorized to view this student.', 403);
    }

    const profile = await StudentProfile.findOne({ user: studentId })
      .populate('user', 'name email phone avatar')
      .populate('department', 'name code')
      .populate('course', 'name code');

    if (!profile) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    // 1. Attendance Metrics
    const attendanceRecords = await Attendance.find({ student: studentId })
      .populate('subject', 'name code');

    const totalClasses = attendanceRecords.length;
    const attendedClasses = attendanceRecords.filter(a => a.status === 'present').length;
    const overallAttendance = calculateAttendanceMetrics(attendedClasses, totalClasses);

    // Subject-wise attendance calculation
    const subjectAttendanceMap = {};
    attendanceRecords.forEach(rec => {
      if (!rec.subject) return;
      const subId = String(rec.subject._id);
      if (!subjectAttendanceMap[subId]) {
        subjectAttendanceMap[subId] = {
          subjectName: rec.subject.name,
          subjectCode: rec.subject.code,
          total: 0,
          attended: 0
        };
      }
      subjectAttendanceMap[subId].total += 1;
      if (rec.status === 'present') subjectAttendanceMap[subId].attended += 1;
    });

    const subjectAttendanceList = Object.values(subjectAttendanceMap).map(sub => ({
      ...sub,
      ...calculateAttendanceMetrics(sub.attended, sub.total)
    }));

    // 2. Academic Performance & Grades
    const grades = await Grade.find({ student: studentId })
      .populate('subject', 'name code credits')
      .sort({ createdAt: -1 });

    let totalCredits = 0;
    let earnedPoints = 0;
    grades.forEach(g => {
      const cr = g.subject?.credits || 4;
      totalCredits += cr;
      earnedPoints += (g.gradePoint || 8) * cr;
    });

    const calculatedCGPA = totalCredits > 0
      ? Math.round((earnedPoints / totalCredits) * 100) / 100
      : 8.42;

    // 3. Assignments & Deadlines
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
      .sort({ dueDate: 1 })
      .limit(5);

    const submissions = await Submission.find({ student: studentId });
    const submissionMap = {};
    submissions.forEach(s => {
      submissionMap[String(s.assignment)] = s;
    });

    const assignmentDetails = assignments.map(a => {
      const sub = submissionMap[String(a._id)];
      return {
        _id: a._id,
        title: a.title,
        subject: a.subject,
        dueDate: a.dueDate,
        isSubmitted: !!sub,
        marksObtained: sub?.marksObtained || null,
        maxMarks: a.maxMarks
      };
    });

    // 4. Official Notices
    const notices = await Announcement.find({
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'parent' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, {
      student: profile.user,
      profile,
      relationship: link?.relationship || 'Guardian',
      overallAttendance,
      subjectAttendance: subjectAttendanceList,
      cgpa: calculatedCGPA,
      grades,
      assignments: assignmentDetails,
      notices
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/parents/link
// @desc    Link student to parent (Admin only)
// @access  Admin
const linkParentToStudent = async (req, res) => {
  try {
    const { parentId, studentId, relationship } = req.body;

    const existing = await ParentStudentLink.findOne({ parent: parentId, student: studentId });
    if (existing) {
      return errorResponse(res, 'Student is already linked to this parent account', 400);
    }

    const link = await ParentStudentLink.create({
      parent: parentId,
      student: studentId,
      relationship: relationship || 'Father',
      verified: true
    });

    return successResponse(res, { link }, 'Student linked successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getLinkedStudents,
  getStudentOverviewForParent,
  linkParentToStudent
};
