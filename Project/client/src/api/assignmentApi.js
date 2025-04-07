import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/assignments';

export const createAssignment = async (assignmentData) => {
  return axios.post(API_BASE, assignmentData);
};

export const getAssignmentsByCourse = async (courseId) => {
  return axios.get(`${API_BASE}/${courseId}`);
};
