const StudyMaterial = require('../models/StudyMaterial');
const StudentProfile = require('../models/StudentProfile');
const { summarizeStudyMaterial } = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @route   GET /api/materials
// @desc    Get study materials with role filtering
// @access  Authenticated
const getMaterials = async (req, res) => {
  try {
    const { subject, department, semester, category, search } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (department) query.department = department;
    if (semester) query.semester = Number(semester);
    if (category) query.category = category;

    if (req.user.role === 'student' && !department && !semester) {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        query.department = profile.department;
        query.semester = profile.currentSemester;
      }
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const materials = await StudyMaterial.find(query)
      .populate('subject', 'name code')
      .populate('faculty', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    return successResponse(res, { materials });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/materials
// @desc    Upload study material (Faculty, Admin)
// @access  Faculty, Admin
const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subject, department, semester, category } = req.body;

    if (!title || !subject || !department || !semester) {
      return errorResponse(res, 'Title, subject, department, and semester are required', 400);
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '1.5 MB';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || 'Lecture_Notes.pdf';
    } else {
      return errorResponse(res, 'File attachment is required', 400);
    }

    // Auto-generate AI summary of the lecture material
    let summary = '';
    try {
      summary = await summarizeStudyMaterial(title, description || `${title} lecture document for semester ${semester}`);
    } catch (e) {
      summary = `Overview: High-yield lecture notes for ${title}. Covers key theoretical concepts, examination questions, and practical implementation notes.`;
    }

    const material = await StudyMaterial.create({
      title,
      description: description || '',
      subject,
      faculty: req.user._id,
      department,
      semester: Number(semester),
      category: category || 'Lecture Notes',
      fileUrl,
      fileName,
      fileSize,
      summary
    });

    return successResponse(res, { material }, 'Study material uploaded successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/materials/:id/summarize
// @desc    Generate on-demand AI summary for a study material
// @access  Authenticated
const summarizeMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).populate('subject', 'name code');
    if (!material) {
      return errorResponse(res, 'Study material not found', 404);
    }

    const summary = await summarizeStudyMaterial(
      material.title,
      `Subject: ${material.subject?.name}. Description: ${material.description}`
    );

    material.summary = summary;
    await material.save();

    return successResponse(res, { summary }, 'AI summary generated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route   POST /api/materials/:id/download-count
// @desc    Increment download counter
// @access  Authenticated
const incrementDownload = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
    return successResponse(res, { downloadsCount: material?.downloadsCount || 0 });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getMaterials,
  uploadMaterial,
  summarizeMaterialById,
  incrementDownload
};
