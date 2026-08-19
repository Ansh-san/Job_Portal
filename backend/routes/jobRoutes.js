const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, requireRole('employer'), createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, requireRole('employer'), updateJob)
  .delete(protect, requireRole('employer'), deleteJob);

module.exports = router;
