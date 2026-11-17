const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const { notifyUser } = require('../services/socketService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Map score percentage to Grade Letter and Points (10-point scale)
const calculateGradeDetails = (marksObtained, maxMarks) => {
  const percentage = (marksObtained / maxMarks) * 100;
  if (percentage >= 90) return { gradeLetter: 'O', gradePoint: 10 };
  if (percentage >= 80) return { gradeLetter: 'A+', gradePoint: 9 };
  if (percentage >= 70) return { gradeLetter: 'A', gradePoint: 8 };
  if (percentage >= 60) return { gradeLetter: 'B+', gradePoint: 7 };
  if (percentage >= 50) return { gradeLetter: 'B', gradePoint: 6 };
  if (percentage >= 40) return { gradeLetter: 'C', gradePoint: 5 };
  return { gradeLetter: 'F', gradePoint: 0 };
};

// @route   POST /api/grades
// @desc    Faculty / Admin enters or updates marks for a student
// @access  Faculty, Admin
const recordGrade = async (req, res) => {
  try {
    const { studentId, subjectId, semester, examType, marksObtained, maxMarks, remarks, academicYear } = req.body;

    if (!studentId || !subjectId || !examType || marksObtained === undefined) {
      return errorResponse(res, 'studentId, subjectId, examType, and marksObtained are required', 400);
    }

    const max = maxMarks || 100;
    const { gradeLetter, gradePoint } = calculateGradeDetails(marksObtained, max);

    const grade = await Grade.findOneAndUpdate(
      {
        student: studentId,
        subject: subjectId,
        examType,
        semester: semester || 1
      },
      {
        student: studentId,
        subject: subjectId,
        semester: semester || 1,
        academicYear: academicYear || '2024-2025',
        examType,
        marksObtained: Number(marksObtained),
        maxMarks: max,
        gradeLetter,
        gradePoint,
        remarks: remarks || '',
        recordedBy: req.user._id
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Notify student
    const subject = await Subject.findById(subjectId).select('name code');
    const notif = await Notification.create({
      recipient: studentId,
      title: '📈 New Grade Published',
      message: `Marks posted for ${subject?.name || 'subject'} (${examType}): ${marksObtained}/${max} [${gradeLetter}]`,
      type: 'grade',
      link: '/student/grades'
    });
    notifyUser(studentId, 'notification', notif);

    return successResponse(res, { grade }, 'Grade recorded successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/grades/student/:studentId
// @desc    Get all grades and CGPA analytics for a student
// @access  Authenticated
const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    if (req.user.role === 'student' && String(studentId) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized access to other student grades', 403);
    }

    const { semester } = req.query;
    const query = { student: studentId };
    if (semester) query.semester = Number(semester);

    const grades = await Grade.find(query)
      .populate('subject', 'name code credits semester')
      .populate('recordedBy', 'name')
      .sort({ semester: 1, createdAt: -1 });

    // Calculate Semester-wise SGPA and Cumulative CGPA
    const semesterMap = {};
    grades.forEach(g => {
      const sem = g.semester;
      if (!semesterMap[sem]) {
        semesterMap[sem] = {
          semester: sem,
          totalCredits: 0,
          earnedPoints: 0,
          subjects: []
        };
      }

      const credits = g.subject?.credits || 4;
      semesterMap[sem].totalCredits += credits;
      semesterMap[sem].earnedPoints += (g.gradePoint || 8) * credits;
      semesterMap[sem].subjects.push(g);
    });

    let overallTotalCredits = 0;
    let overallEarnedPoints = 0;

    const semesterAnalytics = Object.values(semesterMap).map(semData => {
      const sgpa = semData.totalCredits > 0
        ? Math.round((semData.earnedPoints / semData.totalCredits) * 100) / 100
        : 8.5;

      overallTotalCredits += semData.totalCredits;
      overallEarnedPoints += semData.earnedPoints;

      return {
        semester: semData.semester,
        sgpa,
        totalCredits: semData.totalCredits,
        subjectsCount: semData.subjects.length
      };
    });

    const cgpa = overallTotalCredits > 0
      ? Math.round((overallEarnedPoints / overallTotalCredits) * 100) / 100
      : (semesterAnalytics[0]?.sgpa || 8.45);

    return successResponse(res, {
      cgpa,
      semesterAnalytics,
      grades
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  recordGrade,
  getStudentGrades
};
