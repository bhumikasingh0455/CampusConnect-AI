const Subject = require('../models/Subject');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getSubjects = async (req, res) => {
  try {
    const { department, course, semester, faculty } = req.query;
    const query = {};

    if (department) query.department = department;
    if (course) query.course = course;
    if (semester) query.semester = semester;
    if (faculty) query.faculty = faculty;

    const subjects = await Subject.find(query)
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate('faculty', 'name email')
      .sort({ semester: 1, name: 1 });

    return successResponse(res, { subjects });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate('faculty', 'name email');

    if (!subject) {
      return errorResponse(res, 'Subject not found', 404);
    }
    return successResponse(res, { subject });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code, department, course, semester, credits, faculty, syllabus } = req.body;

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      department,
      course,
      semester,
      credits: credits || 4,
      faculty: faculty || null,
      syllabus: syllabus || ''
    });

    return successResponse(res, { subject }, 'Subject created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name, code, department, course, semester, credits, faculty, syllabus } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return errorResponse(res, 'Subject not found', 404);
    }

    if (name) subject.name = name;
    if (code) subject.code = code.toUpperCase();
    if (department) subject.department = department;
    if (course) subject.course = course;
    if (semester) subject.semester = semester;
    if (credits) subject.credits = credits;
    if (faculty !== undefined) subject.faculty = faculty || null;
    if (syllabus !== undefined) subject.syllabus = syllabus;

    await subject.save();
    return successResponse(res, { subject }, 'Subject updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return errorResponse(res, 'Subject not found', 404);
    }
    return successResponse(res, {}, 'Subject deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
