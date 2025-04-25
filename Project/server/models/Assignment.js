// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,  // This field will reference the course the assignment belongs to
  },
  title: {
    type: String,
    required: true,  // Title of the assignment
  },
  description: {
    type: String,
    required: true,  // Detailed description of the assignment
  },
  dueDate: {
    type: Date,
    required: true,  // Due date of the assignment
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model for Assignment
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
