import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_API_BASE_URL}/progress`;

// Get student progress (their own submissions)
export const getStudentProgress = async () => {
  return axios.get(`${API_BASE}/student`);
};

// Get tutor progress (submissions for a course)
export const getTutorProgress = async (courseId) => {
  return axios.get(`${API_BASE}/tutor/${courseId}`);
};