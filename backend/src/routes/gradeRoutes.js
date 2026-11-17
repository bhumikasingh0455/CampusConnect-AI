const express = require('express');
const router = express.Router();
const { recordGrade, getStudentGrades } = require('../controllers/gradeController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.post('/', authenticate, authorize('faculty', 'admin'), recordGrade);
router.get('/student/:studentId', authenticate, getStudentGrades);

module.exports = router;
