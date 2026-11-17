const { askGemini, generateStudySchedule, summarizeStudyMaterial } = require('../services/geminiService');
const Subject = require('../models/Subject');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const { calculateAttendanceMetrics } = require('../utils/predictor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   POST /api/ai/chat
// @desc    Interact with Gemini AI Campus Assistant
// @access  Authenticated
const chatWithAssistant = async (req, res) => {
  try {
    const { prompt, conversationHistory } = req.body;

    if (!prompt) {
      return errorResponse(res, 'Prompt is required', 400);
    }

    const contextData = {
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role
    };

    if (req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id })
        .populate('department', 'name code')
        .populate('course', 'name code');

      if (profile) {
        contextData.department = profile.department?.name;
        contextData.currentSemester = profile.currentSemester;
      }
    }

    const reply = await askGemini(prompt, conversationHistory || [], contextData);

    return successResponse(res, { reply });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/ai/study-schedule
// @desc    Generate personalized AI study schedule
// @access  Authenticated
const getPersonalizedStudySchedule = async (req, res) => {
  try {
    const { dailyHoursAvailable = 3 } = req.body;
    let subjects = [];

    if (req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        subjects = await Subject.find({
          course: profile.course,
          semester: profile.currentSemester
        }).select('name code credits');
      }
    }

    if (subjects.length === 0) {
      subjects = [
        { name: 'Data Structures & Algorithms', credits: 4 },
        { name: 'Database Management Systems', credits: 4 },
        { name: 'Operating Systems', credits: 3 },
        { name: 'Computer Networks', credits: 3 },
        { name: 'Full Stack Development', credits: 4 }
      ];
    }

    const schedulePlan = await generateStudySchedule(subjects, dailyHoursAvailable);

    return successResponse(res, {
      schedule: schedulePlan,
      subjects
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/ai/performance-insights
// @desc    AI analyzes student's attendance & grades to provide actionable improvement tips
// @access  Authenticated
const getPerformanceInsights = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user._id : req.body.studentId;

    const [attendanceRecords, profile] = await Promise.all([
      Attendance.find({ student: studentId }).populate('subject', 'name code'),
      StudentProfile.findOne({ user: studentId }).populate('department', 'name code')
    ]);

    const total = attendanceRecords.length;
    const attended = attendanceRecords.filter(a => a.status === 'present').length;
    const metrics = calculateAttendanceMetrics(attended, total);

    const prompt = `Student Attendance Performance:
- Overall Attendance: ${metrics.percentage}% (${attended}/${total} classes attended).
- Minimum Threshold: 75%.
- Shortage status: ${metrics.isLowAttendance ? 'Shortage alert! Needs ' + metrics.classesNeededFor75 + ' consecutive classes.' : 'Healthy standing.'}

Provide 3 personalized, actionable academic coaching suggestions for this student to maintain strong performance, balance self-study, and prevent academic penalties.`;

    const insights = await askGemini(prompt, [], {
      userRole: 'student',
      department: profile?.department?.name
    });

    return successResponse(res, {
      metrics,
      insights
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  chatWithAssistant,
  getPersonalizedStudySchedule,
  getPerformanceInsights
};
