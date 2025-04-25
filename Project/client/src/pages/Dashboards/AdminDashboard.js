import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin</h1>
      <p className="subtitle">You can manage the following modules:</p>

      <div className="admin-actions">
        <button onClick={() => navigate("course-management")}>
          Manage Courses & Assignments
        </button>

        <button onClick={() => navigate("/dashboard/admin/analytics")}>
          View Student Progress
        </button>

        <button onClick={() => navigate("/dashboard/admin/reviews")}>
          View Reviews
        </button>
      </div>
    </div>
  );
}
