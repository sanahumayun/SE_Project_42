import API from './client';
import { getToken } from '../utils/auth';

export const createReview = async (reviewData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await API.post('/reviews', reviewData, config);
  return response.data;
};

export const getInstructorReviews = async (instructorId) => {
  const response = await API.get(`/reviews/instructor/${instructorId}`);
  return response.data;
};

export const getPublicReviews = async () => {
  const response = await API.get(`/reviews/public`);
  return response.data;
};

export const markHelpful = async (reviewId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await API.put(`/reviews/${reviewId}/helpful`, {}, config);
  return response.data;
};
