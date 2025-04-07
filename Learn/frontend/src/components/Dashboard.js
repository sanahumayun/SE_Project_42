import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import TutorDashboard from './TutorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const [role, setRole] = useState('student');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Select a role (testing static pages):</p>
      <button onClick={() => setRole('admin')}>Admin</button>
      <button onClick={() => setRole('tutor')}>Tutor</button>
      <button onClick={() => setRole('student')}>Student</button>

      {role === 'admin' && <AdminDashboard />}
      {role === 'tutor' && <TutorDashboard />}
      {role === 'student' && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;
