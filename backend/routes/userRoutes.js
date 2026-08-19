const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/resume',
  protect,
  requireRole('jobseeker'),
  (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadResume
);

module.exports = router;
