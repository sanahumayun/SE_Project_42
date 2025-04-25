import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard">
      <h1>Welcome, Student!</h1>
      <p className="subtitle">Here's your personalized dashboard:</p>

      <div className="student-actions">
        <button onClick={() => navigate('my-courses')}>
          My Courses
        </button>

        <button onClick={() => navigate('progress')}>
          Track My Progress
        </button>

        <button onClick={() => navigate('assignments')}>
          Submit Assignments
        </button>

        <button onClick={() => navigate('reviews')}>
          Rate My Tutors
        </button>
      </div>
    </div>
  );
}
