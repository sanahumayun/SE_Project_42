const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, description, tutor, price } = req.body;
    const newCourse = new Course({ title, description, tutor, price });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
