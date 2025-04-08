import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi';
import { getAssignmentsByCourse } from '../api/assignmentApi';

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getCourses().then(res => setCourses(res.data));
  }, []);

  const handleCourseSelect = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    const res = await getAssignmentsByCourse(courseId);
    setAssignments(res.data);
  };

  return (
    <div>
      <h2>View Assignments</h2>
      <select onChange={handleCourseSelect}>
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>{course.name}</option>
        ))}
      </select>

      {assignments.length > 0 && (
        <ul>
          {assignments.map(a => (
            <li key={a._id}>
              <strong>{a.title}</strong> — due {new Date(a.dueDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentCourseView;
