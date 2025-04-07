const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String }, // optional for file uploads later
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
