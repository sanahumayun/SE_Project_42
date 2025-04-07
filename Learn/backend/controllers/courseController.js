const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    // Assuming req.user is set by your auth middleware
    const tutor = req.user.userId; // tutor's ID from JWT

    const course = await Course.create({ title, description, tutor });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('tutor', 'name email');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
