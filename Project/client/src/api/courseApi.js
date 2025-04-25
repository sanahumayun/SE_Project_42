import API from './client';

const API_BASE = process.env.REACT_APP_API_BASE_URL + '/courses';

export const createCourse = async (courseData) => {
  return API.post('/courses', courseData);
};

export const getCourses = async () => {
  return API.get('/courses');
};
