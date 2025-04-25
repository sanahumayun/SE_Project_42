// client/src/pages/dashboard/TutorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorDashboard.css';

export default function TutorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="tutor-dashboard">
      <h1>Welcome, Tutor!</h1>
      <p className="subtitle">Manage your courses and monitor students:</p>

      <div className="tutor-actions">
        <button onClick={() => navigate('manage-courses')}>
          Manage My Courses
        </button>

        <button onClick={() => navigate('student-progress')}>
          View Student Progress
        </button>

        <button onClick={() => navigate('create-assignment')}>
          Create Assignments
        </button>
      </div>
    </div>
  );
}
