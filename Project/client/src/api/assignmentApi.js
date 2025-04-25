import API from './client';

export const createAssignment = async (assignmentData) => {
  return API.post('/courses', assignmentData);
};

export const getAssignmentsByCourse = async (courseId) => {
  return API.get(`/courses/${courseId}`);
};
