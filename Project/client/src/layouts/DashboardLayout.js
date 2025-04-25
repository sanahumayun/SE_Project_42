import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSideBar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const role = localStorage.getItem('role');

  if (!role || !['student', 'tutor', 'admin'].includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
