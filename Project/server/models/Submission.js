// models/submission.js

const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema(
//   {
//     assignmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Assignment",
//       required: true,
//     },
//     studentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

const submissionSchema = new mongoose.Schema({
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
      student   : { type: mongoose.Schema.Types.ObjectId, ref: "User",       required: true },
   
      /** link back so tutors can query easily */
      course    : { type: mongoose.Schema.Types.ObjectId, ref: "Course",     required: true },
      tutor     : { type: mongoose.Schema.Types.ObjectId, ref: "User" },            
   
      fileUrl   : { type: String,   required: true },
      submittedAt: { type: Date,    default: Date.now },
    }, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
