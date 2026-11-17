const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/', authenticate, getAnnouncements);
router.post('/', authenticate, authorize('admin', 'faculty'), upload.single('attachment'), createAnnouncement);
router.put('/:id', authenticate, authorize('admin', 'faculty'), upload.single('attachment'), updateAnnouncement);
router.delete('/:id', authenticate, authorize('admin', 'faculty'), deleteAnnouncement);

module.exports = router;
