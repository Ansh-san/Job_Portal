const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/me', protect, requireRole('jobseeker'), getMyApplications);
router.post('/:jobId', protect, requireRole('jobseeker'), applyForJob);

router.get('/job/:jobId', protect, requireRole('employer'), getJobApplicants);
router.patch('/:id/status', protect, requireRole('employer'), updateApplicationStatus);

module.exports = router;
