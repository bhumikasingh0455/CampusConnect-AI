const express = require('express');
const router = express.Router();
const {
  markAttendance,
  generateClassQR,
  verifyClassQR,
  getStudentAttendance,
  getSubjectAttendanceReport
} = require('../controllers/attendanceController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.post('/mark', authenticate, authorize('faculty', 'admin'), markAttendance);
router.post('/generate-qr', authenticate, authorize('faculty', 'admin'), generateClassQR);
router.post('/verify-qr', authenticate, authorize('student'), verifyClassQR);
router.get('/student/:studentId', authenticate, getStudentAttendance);
router.get('/subject-report/:subjectId', authenticate, authorize('faculty', 'admin'), getSubjectAttendanceReport);

module.exports = router;
