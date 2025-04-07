const Course = require('../models/Course');

const createCourse = async (req, res) => {
  const { name, description, tutorId } = req.body;

  if (!name || !tutorId) {
    return res.status(400).json({ message: 'Course name and tutorId are required' });
  }

  try {
    const newCourse = await Course.create({ name, description, tutorId });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//does not implement getting enrolled courses

// Optional: Get all courses for admin/tutor (not filtered by enrollment)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('tutorId', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
};
