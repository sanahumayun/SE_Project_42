// routes/submissionRoutes.js

const express = require("express");
const router = express.Router();
const { submitAssignment, getSubmissionsForAssignment } = require("../controllers/submissionController");
const {authenticate, checkRole} = require("../middleware/authMiddleware");  // Assuming protect middleware to handle authentication

router.post('/submit/:assignmentId', authenticate, checkRole(['student']), (req, res, next) => {
    // console.log("📡 submission route matched!");
    next(); // pass control to the actual controller
  }, submitAssignment);
  
// GET route to view all submissions for a specific assignment (for tutors/admins)
router.get("/:assignmentId", authenticate, checkRole(['tutor', 'admin']), (req, res, next) => {
    console.log("📡 submission route matched!");
    next(); // pass control to the actual controller
  }, getSubmissionsForAssignment);

module.exports = router;
