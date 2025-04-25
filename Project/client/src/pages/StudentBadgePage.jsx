
import React, { useState, useEffect } from 'react';
import { getCourses } from '../api/courseApi';      // ← named import, matches your api file
import StudentBadges from '../components/StudentBadges';

export default function StudentBadgesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then(data => setCourses(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Awards</h1>
      <StudentBadges courses={courses} />
    </div>
  );
}
