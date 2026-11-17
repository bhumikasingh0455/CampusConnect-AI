const express = require('express');
const router = express.Router();
const {
  getMaterials,
  uploadMaterial,
  summarizeMaterialById,
  incrementDownload
} = require('../controllers/studyMaterialController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/', authenticate, getMaterials);
router.post('/', authenticate, authorize('faculty', 'admin'), upload.single('file'), uploadMaterial);
router.post('/:id/summarize', authenticate, summarizeMaterialById);
router.post('/:id/download-count', authenticate, incrementDownload);

module.exports = router;
