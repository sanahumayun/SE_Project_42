import React from 'react';
import { Routes, Route } from 'react-router-dom';

import TutorDashboard from '../pages/Dashboards/TutorDashboard';
import TutorUploadAssignment from '../components/TutorUploadAssignment';
import TutorViewProgress     from '../components/TutorViewProgress';
import InstructorReviews from '../components/InstructorReviews'; 
import ChatLayout            from '../components/ChatLayout';


export default function TutorRoutes() {
  return (
    <Routes>
      <Route index element={<TutorDashboard />} />
      <Route path="courses"    element={<TutorDashboard />} />
      <Route path="create-assignment" element={<TutorUploadAssignment />} />
      <Route path="student-progress"  element={<TutorViewProgress />} />
      <Route path="reviews"           element={<InstructorReviews />} />
      <Route path="chat"             element={<ChatLayout />} />
    </Routes>
  );
}
