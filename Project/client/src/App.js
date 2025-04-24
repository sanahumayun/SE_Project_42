import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

import TutorUploadAssignment from "./components/TutorUploadAssignment";
import StudentCourseView from "./components/StudentCourseView";
import StudentSubmitAssignment from "./components/StudentSubmitAssignment";
import StudentProgress from "./components/StudentProgress";
import TutorViewProgress from "./components/TutorViewProgress";
import CourseList from "./pages/Courses/CourseList";
import CreateCourse from "./pages/Courses/CreateCourse";

import InstructorReviews from "./components/InstructorReviews";
import SubmitReviewForm from "./components/SubmitReviewForm";

import { ChatProvider } from "../src/ChatContext";
import ChatLayout from "../src/components/ChatLayout";
import "./App.css";

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
      </Routes>
    </Router>
  );
}


export default App;
