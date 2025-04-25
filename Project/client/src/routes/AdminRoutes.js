import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard   from '../pages/Dashboards/AdminDashboard';
// import CourseManagement from '../pages/Dashboards/CourseManagement';
// import AnalyticsDashboard from '../pages/Dashboards/AnalyticsDashboard';
// import ReviewsPage      from '../pages/Dashboards/ReviewsPage'; 

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      {/* <Route path="course-management" element={<CourseManagement />} />
      <Route path="analytics" element={<AnalyticsDashboard />} />
      <Route path="reviews" element={<ReviewsPage />} /> */}
    </Routes>
  );
}
