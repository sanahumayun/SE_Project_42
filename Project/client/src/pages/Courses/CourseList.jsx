import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courseApi'); 
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm text-gray-600">
                Instructor: {course.instructor?.name} ({course.instructor?.email})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
