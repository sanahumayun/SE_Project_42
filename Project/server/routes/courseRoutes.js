const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/', courseController.getAllCourses);

// Protected routes
router.post('/', authenticate, courseController.createCourse); //for admin
router.get('/my-courses', authenticate, courseController.getMyEnrolledCourses); // For students
router.get('/my-teaching-courses', authenticate, courseController.getMyTeachingCourses); // For tutors

module.exports = router;