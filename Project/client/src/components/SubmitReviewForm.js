// import React, { useState, useEffect } from 'react'; //change: added useEffect
// import axios from 'axios'; //change: added axios for fetching courses
// //import React, { useState } from 'react';
// import { createReview } from '../api/reviewApi';
// import StarRatingInput from '../common/StarRatingInput';
// import { toast } from 'react-toastify';


// const SubmitReviewForm = ({ instructorId, courseId, onSuccess }) => {
//   //change: added state for enrolled courses and expanded review data
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [isPublic, setIsPublic] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   //change: added useEffect to fetch enrolled courses
//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       try {
//         const response = await axios.get('/api/courses/enrolled');
//         setEnrolledCourses(response.data);
//         // Auto-select if courseId is provided
//         if (courseId) {
//           const course = response.data.find(c => c._id === courseId);
//           if (course) setSelectedCourse(course);
//         }
//       } catch (error) {
//         toast.error('Failed to load enrolled courses');
//       }
//     };
//     fetchEnrolledCourses();
//   }, [courseId]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // if (!rating || !feedback) {
//     //   toast.error('Please provide both a rating and feedback');
//     //   return;
//     // }
//     //change: updated validation to include course selection
//     if (!rating || !feedback || !selectedCourse) {
//       toast.error('Please provide all required fields');
//       return;
//     }

//     //change: enforce 1-5 rating
//     if (rating < 1 || rating > 5) {
//       toast.error('Rating must be between 1 and 5');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // await createReview({
//       //   instructor: instructorId,
//       //   rating,
//       //   feedback,
//       //   course: courseId,
//       //   isPublic
//       // });
//       await createReview({
//         instructor: selectedCourse.instructorId._id, //change: use selected course's instructor
//         instructorName: selectedCourse.instructorId.name, //change: added instructor name
//         course: selectedCourse._id, //change: use selected course
//         courseName: selectedCourse.title, //change: added course name
//         rating,
//         feedback,
//         isPublic
//       });
//       toast.success('Review submitted successfully!');
//       onSuccess();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit review');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="review-form">
//       <h3>Submit Your Review</h3>
//       <form onSubmit={handleSubmit}>
//         {/* change: added course selection dropdown */}
//         <div className="form-group">
//           <label>Select Course:</label>
//           <select
//             value={selectedCourse?._id || ''}
//             onChange={(e) => {
//               const course = enrolledCourses.find(c => c._id === e.target.value);
//               setSelectedCourse(course);
//             }}
//             required
//             disabled={!!courseId} // Disable if courseId is provided
//           >
//             <option value="">Select a course</option>
//             {enrolledCourses.map(course => (
//               <option key={course._id} value={course._id}>
//                 {course.title} - {course.instructorId.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Rating (1-5 stars):</label> {/* change: added rating range */}
//           <StarRatingInput 
//             rating={rating} 
//             setRating={setRating}
//             maxStars={5} //change: ensure only 5 stars max
//           />
//         </div>
        
//         <div className="form-group">
//           <label>Feedback:</label>
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             rows="4"
//             required
//           />
//         </div>
        
//         <div className="form-group checkbox">
//           <input
//             type="checkbox"
//             id="isPublic"
//             checked={isPublic}
//             onChange={(e) => setIsPublic(e.target.checked)}
//           />
//           <label htmlFor="isPublic">Make this review public</label>
//         </div>
        
//         <button type="submit" disabled={submitting || !selectedCourse}> {/* change: added disabled condition */}
//           {submitting ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SubmitReviewForm;

//   return (
//     <div className="review-form">
//       <h3>Submit Your Review</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Rating:</label>
//           <StarRatingInput rating={rating} setRating={setRating} />
//         </div>
        
//         <div className="form-group">
//           <label>Feedback:</label>
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             rows="4"
//             required
//           />
//         </div>
        
//         <div className="form-group checkbox">
//           <input
//             type="checkbox"
//             id="isPublic"
//             checked={isPublic}
//             onChange={(e) => setIsPublic(e.target.checked)}
//           />
//           <label htmlFor="isPublic">Make this review public</label>
//         </div>
        
//         <button type="submit" disabled={submitting}>
//           {submitting ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SubmitReviewForm;


//change 2
import React, { useState } from 'react';
import { createReview } from '../api/reviewApi';
import StarRatingInput from '../common/StarRatingInput';
import { toast } from 'react-toastify';

const SubmitReviewForm = ({ instructorId, instructorName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [courseName, setCourseName] = useState(''); //change: added courseName state
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //change: updated validation to include course name
    if (!rating || !feedback || !courseName) {
      toast.error('Please provide all required fields');
      return;
    }

    //change: enforce 1-5 rating
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        instructor: instructorId,
        instructorName, //change: use passed instructor name
        courseName, //change: use text input value
        rating,
        feedback,
        isPublic
      });
      toast.success('Review submitted successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Submit Your Review</h3>
      <form onSubmit={handleSubmit}>
        {/* change: replaced dropdown with text input */}
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            required
          />
        </div>

        <div className="form-group">
          <label>Rating (1-5 stars):</label>
          <StarRatingInput 
            rating={rating} 
            setRating={setRating}
            maxStars={5}
          />
        </div>
        
        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            required
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic">Make this review public</label>
        </div>
        
        <button type="submit" disabled={submitting || !courseName}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReviewForm;