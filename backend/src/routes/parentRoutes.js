const express = require('express');
const router = express.Router();
const { getLinkedStudents, getStudentOverviewForParent, linkParentToStudent } = require('../controllers/parentController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/students', authenticate, authorize('parent'), getLinkedStudents);
router.get('/student-overview/:studentId', authenticate, authorize('parent', 'admin'), getStudentOverviewForParent);
router.post('/link', authenticate, authorize('admin'), linkParentToStudent);

module.exports = router;
