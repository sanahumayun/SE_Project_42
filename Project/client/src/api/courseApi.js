import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/courses';

export const createCourse = async (courseData) => {
  return axios.post(API_BASE, courseData);
};

export const getCourses = async () => {
  return axios.get(API_BASE);
};
