const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Jobseeker only)
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applicantId = req.user._id;
    const { coverLetter, experience, skills, resumeText } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Calculate Match Score
    let matchScore = 0;
    const applicantSkills = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim().toLowerCase()) 
      : (Array.isArray(skills) ? skills.map(s => s.toLowerCase()) : []);
      
    const jobSkills = job.skillsRequired || [];
    
    if (jobSkills.length > 0 && applicantSkills.length > 0) {
      const matched = jobSkills.filter(js => 
        applicantSkills.some(as => as.includes(js.toLowerCase()) || js.toLowerCase().includes(as))
      );
      matchScore = Math.round((matched.length / jobSkills.length) * 100);
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      coverLetter,
      experience,
      skills: applicantSkills,
      resumeText,
      matchScore
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/me
// @access  Private (Jobseeker only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Verify job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email resumeUrl')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validate status
    const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'hired'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(applicationId).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify ownership of the job
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics for employer dashboard
// @route   GET /api/applications/analytics/employer
// @access  Private (Employer only)
const getEmployerAnalytics = async (req, res) => {
  try {
    const employerId = req.user._id;

    // Find all jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } });

    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    // Calculate status breakdown
    const statusCounts = {
      applied: 0,
      shortlisted: 0,
      hired: 0,
      rejected: 0
    };

    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // Funnel data for Recharts
    const funnelData = [
      { name: 'Applied', value: statusCounts.applied + statusCounts.shortlisted + statusCounts.hired + statusCounts.rejected }, // Total pipeline
      { name: 'Shortlisted', value: statusCounts.shortlisted + statusCounts.hired }, // Those who made it past applied
      { name: 'Hired', value: statusCounts.hired } // Final hires
    ];

    // Applications over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApps = await Application.aggregate([
      { 
        $match: { 
          job: { $in: jobIds },
          appliedAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for Recharts AreaChart
    const timelineData = recentApps.map(item => ({
      date: item._id,
      applications: item.count
    }));

    res.json({
      totalJobs,
      totalApplications,
      statusCounts,
      funnelData,
      timelineData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getEmployerAnalytics
};
