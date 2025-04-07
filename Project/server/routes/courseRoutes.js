const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses } = require('../controllers/courseController');
const { checkRole } = require('../middleware/authMiddleware');

// Admin creates a course
router.post('/', checkRole('admin'), createCourse);

// Optional: View all courses
router.get('/', getAllCourses);

module.exports = router;
