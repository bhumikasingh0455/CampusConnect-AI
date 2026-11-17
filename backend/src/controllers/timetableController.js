const Timetable = require('../models/Timetable');
const StudentProfile = require('../models/StudentProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/timetable
// @desc    Get timetable by department, course, semester, section OR faculty
// @access  Authenticated
const getTimetable = async (req, res) => {
  try {
    const { department, course, semester, section, dayOfWeek, faculty } = req.query;
    const query = {};

    if (department) query.department = department;
    if (course) query.course = course;
    if (semester) query.semester = Number(semester);
    if (section) query.section = section;
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;
    if (faculty) query.faculty = faculty;

    // If student without explicit queries, auto-fill from profile
    if (req.user.role === 'student' && !department && !course) {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        query.department = profile.department;
        query.course = profile.course;
        query.semester = profile.currentSemester;
        query.section = profile.section;
      }
    }

    // If faculty without explicit queries, auto-filter their schedule
    if (req.user.role === 'faculty' && !faculty && !department) {
      query.faculty = req.user._id;
    }

    const timetable = await Timetable.find(query)
      .populate('subject', 'name code')
      .populate('faculty', 'name email avatar')
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ dayOfWeek: 1, startTime: 1 });

    // Group by Day of Week for weekly view convenience
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklySchedule = {};
    daysOrder.forEach(day => {
      weeklySchedule[day] = [];
    });

    timetable.forEach(item => {
      if (weeklySchedule[item.dayOfWeek]) {
        weeklySchedule[item.dayOfWeek].push(item);
      }
    });

    return successResponse(res, {
      allEntries: timetable,
      weeklySchedule
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/timetable
// @desc    Create timetable entry (Admin)
// @access  Admin
const createTimetableEntry = async (req, res) => {
  try {
    const { department, course, semester, section, dayOfWeek, startTime, endTime, subject, faculty, roomNumber } = req.body;

    const entry = await Timetable.create({
      department,
      course,
      semester,
      section: section || 'A',
      dayOfWeek,
      startTime,
      endTime,
      subject,
      faculty,
      roomNumber: roomNumber || 'Hall 101'
    });

    return successResponse(res, { entry }, 'Timetable entry added successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/timetable/:id
// @desc    Update timetable entry (Admin)
// @access  Admin
const updateTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) {
      return errorResponse(res, 'Timetable entry not found', 404);
    }
    return successResponse(res, { entry }, 'Timetable entry updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   DELETE /api/timetable/:id
// @desc    Delete timetable entry (Admin)
// @access  Admin
const deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) {
      return errorResponse(res, 'Timetable entry not found', 404);
    }
    return successResponse(res, {}, 'Timetable entry deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
};
