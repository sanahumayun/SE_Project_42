// controllers/submissionController.js

const Submission = require("../models/Submission");  // The submission model
const Assignment = require("../models/Assignment");  // The assignment model
const User = require("../models/User");  // The user model for identifying students

// // Function to handle assignment submission
// exports.submitAssignment = async (req, res) => {
//   try {
//     // Extract assignmentId from the URL parameters and content from the body
//     const { assignmentId } = req.params;
//     const { content } = req.body;

//     console.log(`Received submission for assignment ID: ${assignmentId}`);
//     console.log(`Content of submission: ${content}`);

//     // Ensure the content is provided
//     if (!content) {
//       console.log("Content is missing in the submission request");
//       return res.status(400).json({ message: "Content is required." });
//     }

//     // Find the assignment to verify it's valid
//     const assignment = await Assignment.findById(assignmentId);
//     console.log(`Fetched assignment: ${assignment ? assignment.title : "Assignment not found"}`);

//     if (!assignment) {
//       console.log("Assignment not found in the database");
//       return res.status(404).json({ message: "Assignment not found." });
//     }

//     // Get the authenticated student ID from the request (assuming user is set by auth middleware)
//     const studentId = req.user._id; // Ensure that authentication middleware is populating `req.user`
//     console.log(`Authenticated student ID: ${studentId}`);

//     // Create a new submission document
//     const submission = new Submission({
//       assignmentId,
//       studentId,
//       content,
//     });

//     console.log("Saving submission to database...");
//     // Save the submission to the database
//     await submission.save();

//     console.log("Assignment submission saved successfully");

//     // Respond with a success message
//     return res.status(201).json({
//       message: "Assignment submitted successfully.",
//       submission,
//     });
//   } catch (error) {
//     console.error("Error submitting assignment:", error);
//     return res.status(500).json({ message: "Error submitting assignment." });
//   }
// };

// // Get all submissions for a specific assignment (for tutors/admins to view submissions)
// exports.getSubmissionsForAssignment = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     console.log(`Fetching submissions for assignment ID: ${assignmentId}`);

//     // Find the assignment and check if it exists
//     const assignment = await Assignment.findById(assignmentId);
//     console.log(`Fetched assignment: ${assignment ? assignment.title : "Assignment not found"}`);

//     if (!assignment) {
//       console.log("Assignment not found in the database");
//       return res.status(404).json({ message: "Assignment not found." });
//     }

//     // Get all submissions for this assignment
//     const submissions = await Submission.find({ assignmentId }).populate("studentId", "name email");
//     console.log(`Found ${submissions.length} submissions for assignment ID: ${assignmentId}`);

//     return res.status(200).json({
//       submissions,
//     });
//   } catch (error) {
//     console.error("Error fetching submissions:", error);
//     return res.status(500).json({ message: "Error fetching submissions." });
//   }
// };



// const Submission = require("../models/Submission");
// const Assignment  = require("../models/Assignment");

/**  POST  /api/submissions/submit/:assignmentId   (student) */
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { fileUrl }      = req.body;            // ← we store the file URL

    if (!fileUrl) return res.status(400).json({ message: "fileUrl is required" });

    /* Look up the assignment → course → tutor */
    const assignment = await Assignment
      .findById(assignmentId)
      .populate("course");                        // so we can access course.tutor

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const course = assignment.course;

    /*  Create the submission */
    const submission = await Submission.create({
      assignment : assignment._id,
      course     : course._id,
      tutor      : course.tutor,                  
      student    : req.user.id,                  // set by auth middleware
      fileUrl,
    });

    return res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error submitting assignment" });
  }
};

/**  GET  /api/submissions/submissions/:assignmentId   (tutor/admin) */
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

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email");

    return res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching submissions" });
  }
};
