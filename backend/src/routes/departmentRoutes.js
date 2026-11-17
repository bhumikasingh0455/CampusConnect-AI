const express = require('express');
const router = express.Router();
const { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', authenticate, getDepartments);
router.get('/:id', authenticate, getDepartmentById);
router.post('/', authenticate, authorize('admin'), createDepartment);
router.put('/:id', authenticate, authorize('admin'), updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), deleteDepartment);

module.exports = router;
