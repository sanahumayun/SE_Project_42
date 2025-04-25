// routes/submissionRoutes.js

const express = require("express");
const router = express.Router();
const { submitAssignment, getSubmissionsForAssignment } = require("../controllers/submissionController");
const {authenticate, checkRole} = require("../middleware/authMiddleware");  // Assuming protect middleware to handle authentication

// POST route to submit an assignment (student submission)
router.post("/submit/:assignmentId", authenticate, checkRole(['student']), submitAssignment);

// GET route to view all submissions for a specific assignment (for tutors/admins)
router.get("/submissions/:assignmentId", authenticate, checkRole(['tutor', 'admin']), getSubmissionsForAssignment);

module.exports = router;
