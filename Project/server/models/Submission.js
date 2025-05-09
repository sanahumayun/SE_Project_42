const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Submission", submissionSchema);
