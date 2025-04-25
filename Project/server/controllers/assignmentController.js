// controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// Upload Assignment
exports.uploadAssignment = async (req, res) => {
  const { courseId } = req.params;  // Course ID from the URL
  const { title, description, dueDate } = req.body;  // Data from the request body

  try {
    // Create a new assignment
    const newAssignment = new Assignment({
      course: courseId,
      title,
      description,
      dueDate,
    });

    // Save the assignment to the database
    await newAssignment.save();

    // Find the course and update it with the new assignment ID
    const course = await Course.findById(courseId);
    course.assignments.push(newAssignment._id);
    await course.save();

    // Send the response back to the client
    res.status(201).json({ message: 'Assignment uploaded successfully!', assignment: newAssignment });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'Error uploading assignment.' });
  }
};

// Get all assignments for a specific course
exports.getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate('assignments');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ assignments: course.assignments });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Error fetching assignments.' });
  }
};

// Get a specific assignment by its ID
exports.getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.status(200).json({ assignment });
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ error: 'Error fetching assignment.' });
  }
};
