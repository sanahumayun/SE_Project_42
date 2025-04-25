// controllers/submissionController.js

const Submission = require("../models/Submission");  // The submission model
const Assignment = require("../models/Assignment");  // The assignment model
const User = require("../models/User");  // The user model for identifying students

// Function to handle assignment submission
exports.submitAssignment = async (req, res) => {
  try {
    // Extract assignmentId from the URL parameters and content from the body
    const { assignmentId } = req.params;
    const { content } = req.body;

    console.log(`Received submission for assignment ID: ${assignmentId}`);
    console.log(`Content of submission: ${content}`);

    // Ensure the content is provided
    if (!content) {
      console.log("Content is missing in the submission request");
      return res.status(400).json({ message: "Content is required." });
    }

    // Find the assignment to verify it's valid
    const assignment = await Assignment.findById(assignmentId);
    console.log(`Fetched assignment: ${assignment ? assignment.title : "Assignment not found"}`);

    if (!assignment) {
      console.log("Assignment not found in the database");
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Get the authenticated student ID from the request (assuming user is set by auth middleware)
    const studentId = req.user._id; // Ensure that authentication middleware is populating `req.user`
    console.log(`Authenticated student ID: ${studentId}`);

    // Create a new submission document
    const submission = new Submission({
      assignmentId,
      studentId,
      content,
    });

    console.log("Saving submission to database...");
    // Save the submission to the database
    await submission.save();

    console.log("Assignment submission saved successfully");

    // Respond with a success message
    return res.status(201).json({
      message: "Assignment submitted successfully.",
      submission,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return res.status(500).json({ message: "Error submitting assignment." });
  }
};

// Get all submissions for a specific assignment (for tutors/admins to view submissions)
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
