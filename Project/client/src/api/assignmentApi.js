import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_BASE_URL + '/courses';
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const createAssignment = async (assignmentData) => {
  return axios.post(API_BASE, assignmentData);
};

// export const getAssignmentsByCourse = async (courseId) => {
//   return axios.get(`${API_BASE}/${courseId}`);
// };

export const getAssignmentsByCourse = (courseId) =>
  axios.get(`${API_BASE}/assignments/by-course/${courseId}`);