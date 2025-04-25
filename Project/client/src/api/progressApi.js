import API from './client';

export const getStudentProgress = async () => {
  return API.get(`/progress/student`);
};

export const getTutorProgress = async (courseId) => {
  return API.get(`$/progress/tutor/${courseId}`);
};