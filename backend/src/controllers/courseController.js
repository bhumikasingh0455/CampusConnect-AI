const Course = require('../models/Course');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCourses = async (req, res) => {
  try {
    const { department } = req.query;
    const query = {};
    if (department) query.department = department;

    const courses = await Course.find(query)
      .populate('department', 'name code')
      .sort({ name: 1 });
    return successResponse(res, { courses });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('department', 'name code');
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }
    return successResponse(res, { course });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, code, department, durationYears, totalSemesters, degreeType, description } = req.body;
    const existing = await Course.findOne({ code: code.toUpperCase() });
    if (existing) {
      return errorResponse(res, 'Course with this code already exists', 400);
    }

    const course = await Course.create({
      name,
      code: code.toUpperCase(),
      department,
      durationYears: durationYears || 4,
      totalSemesters: totalSemesters || 8,
      degreeType: degreeType || 'Undergraduate',
      description: description || ''
    });

    return successResponse(res, { course }, 'Course created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, code, department, durationYears, totalSemesters, degreeType, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }

    if (name) course.name = name;
    if (code) course.code = code.toUpperCase();
    if (department) course.department = department;
    if (durationYears) course.durationYears = durationYears;
    if (totalSemesters) course.totalSemesters = totalSemesters;
    if (degreeType) course.degreeType = degreeType;
    if (description !== undefined) course.description = description;

    await course.save();
    return successResponse(res, { course }, 'Course updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }
    return successResponse(res, {}, 'Course deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
