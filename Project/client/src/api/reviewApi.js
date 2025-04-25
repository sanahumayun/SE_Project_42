// import axios from 'axios';
// // import { getToken } from '../utils/auth';

// const API_URL = '/api/reviews';

// // Create a new review
// export const createReview = async (reviewData) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   };
//   const response = await axios.post(API_URL, reviewData, config);
//   return response.data;
// };

// // Get reviews for a specific instructor
// export const getInstructorReviews = async (instructorId) => {
//   const response = await axios.get(`${API_URL}/instructor/${instructorId}`);
//   return response.data;
// };

// // Get all public reviews (for parent dashboard)
// export const getPublicReviews = async () => {
//   const response = await axios.get(`${API_URL}/public`);
//   return response.data;
// };

// // Parent can flag a review as helpful
// export const markHelpful = async (reviewId) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   };
//   const response = await axios.put(`${API_URL}/${reviewId}/helpful`, {}, config);
//   return response.data;
// };


//change
import axios from 'axios';
//change: import getToken if not already imported (uncomment if needed)
// import { getToken } from '../utils/auth';
//change: import getCurrentUserId if you need to automatically add student ID
// import { getCurrentUserId } from '../utils/auth';

const API_URL = '/api/reviews';

// Create a new review
export const createReview = async (reviewData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  //change: modified to include studentId in the request body
  // Note: Only add this if your backend doesn't already get studentId from the token
  const response = await axios.post(API_URL, {
    ...reviewData,
    // studentId: getCurrentUserId() // Uncomment if needed
  }, config);
  return response.data;
};

/* Rest of the file remains exactly the same */
// Get reviews for a specific instructor
export const getInstructorReviews = async (instructorId) => {
  const response = await axios.get(`${API_URL}/instructor/${instructorId}`);
  return response.data;
};

// Get all public reviews (for parent dashboard)
export const getPublicReviews = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
};

// Parent can flag a review as helpful
export const markHelpful = async (reviewId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios.put(`${API_URL}/${reviewId}/helpful`, {}, config);
  return response.data;
};