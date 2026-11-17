const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
} = require('../controllers/assignmentController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/', authenticate, getAssignments);
router.get('/:id', authenticate, getAssignmentById);
router.post('/', authenticate, authorize('faculty', 'admin'), upload.single('attachment'), createAssignment);
router.put('/:id', authenticate, authorize('faculty', 'admin'), upload.single('attachment'), updateAssignment);
router.delete('/:id', authenticate, authorize('faculty', 'admin'), deleteAssignment);

router.post('/:id/submit', authenticate, authorize('student'), upload.single('file'), submitAssignment);
router.put('/grade-submission/:submissionId', authenticate, authorize('faculty', 'admin'), gradeSubmission);

module.exports = router;
