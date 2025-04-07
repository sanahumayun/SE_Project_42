
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  fileUrl: { type: String }, // URL or path to submitted file
  submittedAt: { type: Date, default: Date.now },
  grade: { type: String }, // Optional
  feedback: { type: String }, // Optional
});

module.exports = mongoose.model('Submission', submissionSchema);
