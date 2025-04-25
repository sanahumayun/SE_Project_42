import React from 'react';
import { Routes, Route } from 'react-router-dom';

import StudentDashboard  from '../pages/Dashboards/StudentDashboard';
import StudentCourseView from '../components/StudentCourseView';
import StudentProgress   from '../components/StudentProgress';
import StudentSubmitAssignment from '../components/StudentSubmitAssignment';
import InstructorReviews      from '../components/InstructorReviews'; 
import ChatLayout             from '../components/ChatLayout';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="courses" element={<StudentCourseView />} />
      <Route path="progress"   element={<StudentProgress />} />
      <Route path="assignments" element={<StudentSubmitAssignment />} />
      <Route path="reviews"    element={<InstructorReviews />} />
      <Route path="chat"       element={<ChatLayout />} />
    </Routes>
  );
}

