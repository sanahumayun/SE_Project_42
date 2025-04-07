const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

const createAssignment = async (req, res) => {
  const { courseId, title, description, dueDate } = req.body;

  if (!courseId || !title || !dueDate) {
    return res.status(400).json({ message: 'Course ID, title, and due date are required' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Optional: Check tutor ownership
    if (req.user.role === 'tutor' && req.user._id.toString() !== course.tutorId.toString()) {
      return res.status(403).json({ message: 'You are not the assigned tutor for this course' });
    }

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      dueDate,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create assignment', error: err.message });
  }
};

const getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const assignments = await Assignment.find({ courseId });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
};
