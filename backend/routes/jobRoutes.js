const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// GET /api/jobs – All users (logged in) can view jobs
router.get("/", protect, getAllJobs);

// GET /api/jobs/:id – Get a specific job
router.get("/:id", protect, getJobById);

// POST /api/jobs – Only Recruiters or Admins can post jobs
router.post("/", protect, restrictTo("Recruiter", "Admin"), createJob);

// PUT /api/jobs/:id – Update a job (Recruiter/Admin only)
router.put("/:id", protect, restrictTo("Recruiter", "Admin"), updateJob);

// DELETE /api/jobs/:id – Delete a job (Recruiter/Admin only)
router.delete("/:id", protect, restrictTo("Recruiter", "Admin"), deleteJob);

module.exports = router;
