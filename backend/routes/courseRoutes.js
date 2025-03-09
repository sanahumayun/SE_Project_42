const express = require('express');
const router = express.Router();
const { protect, verifyRole } = require('../middleware/authMiddleware');
const { createCourse, getCourses } = require('../controllers/courseController');

// Public route: get all courses
router.get('/', getCourses);

// Protected route: only tutors or admins can create a course
router.post('/', protect, (req, res, next) => {
  // For simplicity, allow both tutors and admins; you can customize further:
  if (req.user.role === 'tutor' || req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
}, createCourse);

module.exports = router;
