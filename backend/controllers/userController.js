const User = require('../models/User');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { extractResumeData } = require('../services/aiService');

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private (Jobseeker only)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    // Extract text and parse with AI
    let extractedData = { bio: '', skills: [] };
    try {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      // Pass the raw text to our AI service
      extractedData = await extractResumeData(pdfData.text);
    } catch (parseError) {
      console.error('Error parsing PDF or calling AI:', parseError);
    }

    const updateFields = { resumeUrl };
    // Only update if the AI actually returned something useful
    if (extractedData.bio) updateFields.bio = extractedData.bio;
    if (extractedData.skills && extractedData.skills.length > 0) updateFields.skills = extractedData.skills;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save/unsave a job
// @route   POST /api/users/save-job/:id
// @access  Private (Jobseeker only)
const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jobId = req.params.id;
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ message: isSaved ? 'Job removed from saved' : 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { phone, bio, skills, companyName, companyDescription, website } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'jobseeker') {
      if (phone) user.phone = phone;
      if (bio) user.bio = bio;
      if (skills) {
        user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      }
    } else if (user.role === 'employer') {
      if (companyName) user.companyName = companyName;
      if (companyDescription) user.companyDescription = companyDescription;
      if (website) user.website = website;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs').select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  toggleSaveJob,
  updateProfile,
  getUserProfile,
};
