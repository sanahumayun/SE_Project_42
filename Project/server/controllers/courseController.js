const Course = require('../models/Course');

// 1. Get ALL public courses (no auth required)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .select('-studentsEnrolled');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// 2. Create a course (Instructor/Admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only instructors/admins can create courses' });
    }
    const newCourse = await Course.create({ title, description, instructor: req.user.id });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// 3. Get courses for the CURRENTLY LOGGED-IN student
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can fetch enrolled courses' });
    }
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your courses' });
  }
};

// 4. Get courses for the CURRENTLY LOGGED-IN tutor
exports.getMyTeachingCourses = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can fetch their taught courses' });
    }
    const courses = await Course.find({ instructor: req.user.id })
      .populate('studentsEnrolled', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your courses' });
  }
};