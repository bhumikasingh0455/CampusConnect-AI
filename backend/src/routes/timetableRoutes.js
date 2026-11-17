const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
} = require('../controllers/timetableController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', authenticate, getTimetable);
router.post('/', authenticate, authorize('admin'), createTimetableEntry);
router.put('/:id', authenticate, authorize('admin'), updateTimetableEntry);
router.delete('/:id', authenticate, authorize('admin'), deleteTimetableEntry);

module.exports = router;
