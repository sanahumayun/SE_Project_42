const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  grade:        { type: Number, required: true, min: 0 },
  comment:      { type: String },
  gradedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);