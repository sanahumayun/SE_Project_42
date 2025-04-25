// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema(
//   {
//     instructor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     parent: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     feedback: {
//       type: String,
//       required: true,
//     },
//     isPublic: {
//       type: Boolean,
//       default: true,
//     },
//     helpfulCount: {
//       type: Number,
//       default: 0,
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Course',
//     },
//   },
//   { timestamps: true }
// );

// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;


//change 
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Keep existing 'instructor' field as is
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Preserve both 'parent' (existing) and 'studentId' (new) temporarily
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    //change: added studentId while keeping parent for backward compatibility
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Existing rating field (no changes needed)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Existing feedback field (no changes needed)
    feedback: {
      type: String,
      required: true,
    },

    // Existing isPublic field (no changes needed)
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Existing helpfulCount field (no changes needed)
    helpfulCount: {
      type: Number,
      default: 0,
    },

    // Existing course reference (no changes needed)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },

    //change: added new fields for display purposes
    courseName: {
      type: String,
    },
    instructorName: {
      type: String,
    },
  },
  { timestamps: true }
);

//change: add pre-save hook to maintain both studentId and parent fields
reviewSchema.pre('save', function(next) {
  if (this.isNew && !this.studentId) {
    this.studentId = this.parent; // Auto-populate studentId from parent
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;