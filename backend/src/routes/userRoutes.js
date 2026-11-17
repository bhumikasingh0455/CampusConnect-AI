const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getAdminOverview, getAuditLogs } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

// Admin only routes
router.use(authenticate, authorize('admin'));

router.get('/admin-overview', getAdminOverview);
router.get('/audit-logs', getAuditLogs);
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
