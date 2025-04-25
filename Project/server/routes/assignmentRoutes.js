// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { submitAssignment } = require("../controllers/submissionController");

// Route for uploading an assignment to a course
router.post('/:courseId/tutor-upload-assignment', assignmentController.uploadAssignment);

// Route to get all assignments for a specific course
router.get('/:courseId/assignments', assignmentController.getAssignmentsByCourse);

// Route to get a specific assignment by its ID
router.get('/assignment/:assignmentId', assignmentController.getAssignmentById);

router.post("/submit/:assignmentId", authenticate, checkRole(['student']), submitAssignment);

module.exports = router;
