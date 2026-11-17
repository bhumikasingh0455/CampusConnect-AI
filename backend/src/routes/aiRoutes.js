const express = require('express');
const router = express.Router();
const { chatWithAssistant, getPersonalizedStudySchedule, getPerformanceInsights } = require('../controllers/aiController');
const authenticate = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/chat', authenticate, aiLimiter, chatWithAssistant);
router.post('/study-schedule', authenticate, aiLimiter, getPersonalizedStudySchedule);
router.post('/performance-insights', authenticate, aiLimiter, getPerformanceInsights);

module.exports = router;
