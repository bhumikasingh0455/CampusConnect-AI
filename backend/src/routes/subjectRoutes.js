const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', authenticate, getSubjects);
router.get('/:id', authenticate, getSubjectById);
router.post('/', authenticate, authorize('admin'), createSubject);
router.put('/:id', authenticate, authorize('admin'), updateSubject);
router.delete('/:id', authenticate, authorize('admin'), deleteSubject);

module.exports = router;
