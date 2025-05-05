const Grade = require('../models/Grade');
const Submission = require('../models/Submission'); // your existing submission model

exports.listSubmissions = async (req, res) => {
  try {
    const tutorId = req.user.id;

    const subs = await Submission.find({ tutor: tutorId })
      .populate('student', 'name')
      .populate('course', 'title')
      .populate('assignment', 'title')
      .lean();

    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch submissions' });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const { submissionId, grade, comment } = req.body;
    const gradedBy = req.user.id;

    const newGrade = await Grade.create({ submissionId, grade, comment, gradedBy });
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save grade' });
  }
};