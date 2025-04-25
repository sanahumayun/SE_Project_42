// controllers/submissionController.js

const Submission = require("../models/Submission");  // The submission model
const Assignment = require("../models/Assignment");  // The assignment model
const User = require("../models/User");  // The user model for identifying students

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    // Ensure the student is logged in (auth middleware should set req.user)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const studentId = req.user.id; // Get the studentId from authenticated user

    if (!content) {
      return res.status(400).json({ message: "Submission content is required." });
    }

    const submission = new Submission({
      assignmentId,
      studentId, // Add the studentId here
      content,
    });

    await submission.save();

    return res.status(201).json({
      message: "Assignment submitted successfully.",
      submission,
    });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    return res.status(500).json({ message: "Error submitting assignment." });
  }
};

exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log(`Fetching submissions for assignment ID: ${assignmentId}`);

    // Find the assignment and check if it exists
    const assignment = await Assignment.findById(assignmentId);
    console.log(`Fetched assignment: ${assignment ? assignment.title : "Assignment not found"}`);

    if (!assignment) {
      console.log("Assignment not found in the database");
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Get all submissions for this assignment
    const submissions = await Submission.find({ assignmentId }).populate("studentId", "name email");
    console.log(`Found ${submissions.length} submissions for assignment ID: ${assignmentId}`);

    return res.status(200).json({
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ message: "Error fetching submissions." });
  }
};
