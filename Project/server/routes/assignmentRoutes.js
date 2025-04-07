const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
} = require('../controllers/assignmentController');

const { checkRole } = require('../middleware/authMiddleware');

// Tutor creates an assignment
router.post('/', checkRole('tutor'), createAssignment);

// Student views assignments for a course
router.get('/:courseId', getAssignmentsByCourse);

module.exports = router;
