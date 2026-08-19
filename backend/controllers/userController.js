const User = require('../models/User');

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private (Jobseeker only)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
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

module.exports = {
  uploadResume,
};
