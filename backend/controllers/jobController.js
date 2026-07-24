const Job = require("../models/Job");

// ─── GET /api/jobs ────────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const { search, jobType, experience } = req.query;

    let filter = { isActive: true };

    // Full-text search across title, company, location
    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (jobType && jobType !== "All Jobs") {
      filter.tag1 = jobType;
    }

    if (experience && experience !== "All Levels") {
      filter.tag2 = { $regex: experience, $options: "i" };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// ─── GET /api/jobs/:id ────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};

// ─── POST /api/jobs ───────────────────────────────────────────────────────────
// Protected + Recruiter/Admin only
const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Error creating job", error: error.message });
  }
};

// ─── PUT /api/jobs/:id ────────────────────────────────────────────────────────
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: "Error updating job", error: error.message });
  }
};

// ─── DELETE /api/jobs/:id ─────────────────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };
