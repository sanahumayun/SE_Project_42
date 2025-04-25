const Grade = require('../models/Grade');
const Submission = require('../models/Submission'); // your existing submission model

// GET /api/grades/submissions
// returns all submissions (with student & course info) for this tutor
exports.listSubmissions = async (req, res) => {
  try {
    // you probably know req.user.id from your auth middleware
    const tutorId = req.user.id;

    // find all submissions in courses taught by tutor:
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

// POST /api/grades
// body: { submissionId, grade, comment }
exports.createGrade = async (req, res) => {
  try {
    const { submissionId, grade, comment } = req.body;
    const gradedBy = req.user.id;

    // optionally: ensure submission belongs to a tutor’s course
    const newGrade = await Grade.create({ submissionId, grade, comment, gradedBy });
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save grade' });
  }
};
