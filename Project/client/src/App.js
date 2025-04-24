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

function App() {
  useEffect(() => {
    // Retrieve the token from localStorage (assuming you're storing it there)
    const authToken = localStorage.getItem("authToken");

    // If the token exists, set the Authorization header for all axios requests
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"]; // Clear it if no token exists
    }
  }, []);

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
}

export default App;