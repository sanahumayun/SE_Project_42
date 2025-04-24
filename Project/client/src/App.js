import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import TutorDashboard from "./pages/Dashboards/TutorDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";

import CreateCourse from "./pages/Courses/CreateCourse";
import CourseList from "./pages/Courses/CourseList";
import TutorUploadAssignment from "./pages/Courses/TutorUploadAssignment";
import StudentCourseView from "./pages/Courses/StudentCourseView";
import TutorCourseView from "./pages/Courses/TutorCourseView";

import CreateTutor from "./pages/Create_Accounts/CreateTutor";
import CreateStudent from "./pages/Create_Accounts/CreateStudent";

import StudentSubmitAssignment from "./components/StudentSubmitAssignment";
import StudentProgress from "./components/StudentProgress";
import TutorViewProgress from "./components/TutorViewProgress";

import InstructorReviews from "./components/InstructorReviews";
import SubmitReviewForm from "./components/SubmitReviewForm";

import { ChatProvider } from "../src/ChatContext";
import ChatLayout from "../src/components/ChatLayout";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/create-tutor" element={<CreateTutor />} />
        <Route path="/create-student" element={<CreateStudent />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/student-course-view" element={<StudentCourseView />} />
        <Route path="courses/tutor-course-view" element={<TutorCourseView />} />
        <Route path="courses/tutor-upload-assignment" element={<TutorUploadAssignment />} />
      </Routes>
    </Router>
  );
};

export default App;