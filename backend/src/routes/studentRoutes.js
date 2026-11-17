const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, getStudentDashboardOverview } = require('../controllers/studentController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/dashboard/overview', authenticate, authorize('student'), getStudentDashboardOverview);
router.get('/', authenticate, authorize('admin', 'faculty'), getStudents);
router.get('/:id', authenticate, getStudentById);
router.post('/', authenticate, authorize('admin'), createStudent);
router.put('/:id', authenticate, updateStudent);

module.exports = router;
