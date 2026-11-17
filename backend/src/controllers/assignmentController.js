const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const StudentProfile = require('../models/StudentProfile');
const { notifyRole, notifyUser } = require('../services/socketService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/assignments
// @desc    Get assignments list based on user role & query
// @access  Authenticated
const getAssignments = async (req, res) => {
  try {
    const { subject, department, semester, status } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (status) query.status = status;

    // Faculty only views assignments they created (unless admin)
    if (req.user.role === 'faculty') {
      query.faculty = req.user._id;
    }

    // Student only views assignments for their semester & department
    if (req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id });
      if (studentProfile) {
        query.department = studentProfile.department;
        query.semester = studentProfile.currentSemester;
        query.status = 'published';
      }
    }

    const assignments = await Assignment.find(query)
      .populate('subject', 'name code')
      .populate('faculty', 'name email')
      .populate('department', 'name code')
      .sort({ dueDate: 1, createdAt: -1 });

    // If student, attach submission status
    if (req.user.role === 'student') {
      const submissions = await Submission.find({ student: req.user._id });
      const subMap = {};
      submissions.forEach(s => {
        subMap[String(s.assignment)] = s;
      });

      const enrichedAssignments = assignments.map(a => {
        const sub = subMap[String(a._id)];
        return {
          ...a.toObject(),
          mySubmission: sub || null,
          isSubmitted: !!sub,
          isOverdue: new Date(a.dueDate) < new Date() && !sub
        };
      });

      return successResponse(res, { assignments: enrichedAssignments });
    }

    return successResponse(res, { assignments });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   GET /api/assignments/:id
// @desc    Get single assignment details with submissions (if faculty/admin)
// @access  Authenticated
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('faculty', 'name email avatar')
      .populate('department', 'name code');

    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    let submissions = [];
    let mySubmission = null;

    if (req.user.role === 'faculty' || req.user.role === 'admin') {
      submissions = await Submission.find({ assignment: assignment._id })
        .populate('student', 'name email avatar phone')
        .populate('gradedBy', 'name')
        .sort({ submissionDate: -1 });
    } else if (req.user.role === 'student') {
      mySubmission = await Submission.findOne({
        assignment: assignment._id,
        student: req.user._id
      });
    }

    return successResponse(res, {
      assignment,
      submissions,
      mySubmission
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/assignments
// @desc    Create new assignment (Faculty, Admin)
// @access  Faculty, Admin
const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, department, semester, dueDate, maxMarks } = req.body;

    if (!title || !description || !subject || !dueDate) {
      return errorResponse(res, 'Title, description, subject, and dueDate are required', 400);
    }

    let attachment = { url: '', fileName: '' };
    if (req.file) {
      attachment = {
        url: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname
      };
    }

    // Lookup department and semester from Subject if not explicitly provided
    let finalDept = department;
    let finalSem = semester;
    if (!finalDept || !finalSem) {
      const sub = await Subject.findById(subject);
      if (sub) {
        finalDept = finalDept || sub.department;
        finalSem = finalSem || sub.semester;
      }
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      faculty: req.user._id,
      department: finalDept,
      semester: finalSem,
      dueDate,
      maxMarks: maxMarks || 100,
      attachment,
      status: 'published'
    });

    // Notify all students in this semester/department
    const subjectDoc = await Subject.findById(subject);
    const notifMessage = `New assignment posted: "${title}" in ${subjectDoc?.name || 'course'}. Due: ${new Date(dueDate).toLocaleDateString()}`;

    // Find all students in this dept/sem
    const studentsInClass = await StudentProfile.find({
      department: finalDept,
      currentSemester: finalSem
    }).select('user');

    for (const student of studentsInClass) {
      const notif = await Notification.create({
        recipient: student.user,
        title: '📚 New Assignment Published',
        message: notifMessage,
        type: 'assignment',
        link: `/student/assignments/${assignment._id}`
      });
      notifyUser(student.user, 'notification', notif);
    }

    return successResponse(res, { assignment }, 'Assignment created and published successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/assignments/:id
// @desc    Update assignment (Faculty author, Admin)
// @access  Faculty, Admin
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    if (req.user.role === 'faculty' && String(assignment.faculty) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to edit this assignment', 403);
    }

    const { title, description, dueDate, maxMarks, status } = req.body;
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (maxMarks) assignment.maxMarks = maxMarks;
    if (status) assignment.status = status;

    if (req.file) {
      assignment.attachment = {
        url: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname
      };
    }

    await assignment.save();
    return successResponse(res, { assignment }, 'Assignment updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Faculty author, Admin
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    if (req.user.role === 'faculty' && String(assignment.faculty) !== String(req.user._id)) {
      return errorResponse(res, 'Unauthorized to delete this assignment', 403);
    }

    await Submission.deleteMany({ assignment: assignment._id });
    await Assignment.findByIdAndDelete(req.params.id);

    return successResponse(res, {}, 'Assignment deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/assignments/:id/submit
// @desc    Student submits assignment
// @access  Student
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    const studentId = req.user._id;
    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);

    let fileUrl = '';
    let fileName = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const { content } = req.body;

    const submission = await Submission.findOneAndUpdate(
      {
        assignment: assignment._id,
        student: studentId
      },
      {
        assignment: assignment._id,
        student: studentId,
        submissionDate: now,
        fileUrl: fileUrl || req.body.fileUrl || '',
        fileName: fileName || req.body.fileName || 'Solution.pdf',
        content: content || '',
        isLate,
        status: 'submitted'
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Notify the faculty member
    const notif = await Notification.create({
      recipient: assignment.faculty,
      title: '📥 New Assignment Submission',
      message: `${req.user.name} submitted assignment: "${assignment.title}" ${isLate ? '(Late Submission)' : ''}`,
      type: 'assignment',
      link: `/faculty/assignments/${assignment._id}`
    });
    notifyUser(assignment.faculty, 'notification', notif);

    return successResponse(
      res,
      { submission },
      isLate ? 'Assignment submitted (marked as late)' : 'Assignment submitted successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   PUT /api/assignments/grade-submission/:submissionId
// @desc    Faculty grades assignment submission
// @access  Faculty, Admin
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) {
      return errorResponse(res, 'Submission not found', 404);
    }

    submission.marksObtained = Number(marksObtained);
    submission.feedback = feedback || '';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    submission.status = 'graded';

    await submission.save();

    // Notify student about grade
    const notif = await Notification.create({
      recipient: submission.student,
      title: '🎯 Assignment Graded',
      message: `Your submission for "${submission.assignment.title}" has been graded: ${marksObtained}/${submission.assignment.maxMarks} marks.`,
      type: 'grade',
      link: `/student/assignments/${submission.assignment._id}`
    });
    notifyUser(submission.student, 'notification', notif);

    return successResponse(res, { submission }, 'Submission evaluated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
};
