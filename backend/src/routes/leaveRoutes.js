const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, reviewLeave } = require('../controllers/leaveController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');

router.post('/apply', authenticate, upload.single('document'), applyLeave);
router.get('/my-leaves', authenticate, getMyLeaves);
router.get('/all', authenticate, authorize('faculty', 'admin'), getAllLeaves);
router.put('/:id/review', authenticate, authorize('faculty', 'admin'), reviewLeave);

module.exports = router;
