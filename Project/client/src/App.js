// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import "./App.css";

// import LoginPage      from './pages/dashboard/LoginPage';
// import RegisterPage   from './pages/dashboard/RegisterPage';
// import DashboardLayout from './layouts/DashboardLayout';

// import StudentRoutes  from './routes/StudentRoutes';
// import TutorRoutes    from './routes/TutorRoutes';
// import AdminRoutes    from './routes/AdminRoutes';

// import TutorUploadAssignment from "./components/TutorUploadAssignment";
// import StudentCourseView from "./components/StudentCourseView";
// import StudentSubmitAssignment from "./components/StudentSubmitAssignment";
// import StudentProgress from "./components/StudentProgress";
// import TutorViewProgress from "./components/TutorViewProgress";
// import CourseList from "./pages/Courses/CourseList";
// import CreateCourse from "./pages/Courses/CreateCourse";

// import InstructorReviews from "./components/InstructorReviews";
// import SubmitReviewForm from "./components/SubmitReviewForm";

// import { ChatProvider } from "../src/ChatContext";
// import ChatLayout from "../src/components/ChatLayout";

// const App = () => {
//   return (
//     <Router>
//       <div style={{ padding: "20px" }}>
//         {/* 🔗 Navigation Buttons */}
//         <nav style={{ marginBottom: "30px" }}>
//           <Link to="/">
//             <button>🏠 Home</button>
//           </Link>{" "}
//           <Link to="/create-course">
//             <button>🆕 Create Course</button>
//           </Link>{" "}
//           <Link to="/courses">
//             <button>📚 Course List</button>
//           </Link>{" "}
//           <Link to="/tutor-upload">
//             <button>📤 Tutor - Upload Assignment</button>
//           </Link>{" "}
//           <Link to="/student-course-view">
//             <button>👩‍🎓 Student - View Courses</button>
//           </Link>{" "}
//           <Link to="/student-submit">
//             <button>📨 Student - Submit Assignment</button>
//           </Link>
//           <Link to="/instructor-reviews">
//             <button>⭐ Instructor Reviews</button>
//           </Link>{" "}
//           <Link to="/submit-review">
//             <button>✏️ Submit Review</button>
//           </Link>
//         </nav>

//         {/* 📌 Route Setup */}
//         <Routes>
//           <Route
//             path="/"
//             element={<h1>Welcome to Course and Assignment Management</h1>}
//           />
//           <Route path="/tutor-upload" element={<TutorUploadAssignment />} />
//           <Route path="/tutor-progress" element={<TutorViewProgress />} />
//           <Route path="/student-course-view" element={<StudentCourseView />} />
//           <Route path="/student-submit" element={<StudentSubmitAssignment />} />
//           <Route path="/student-progress" element={<StudentProgress />} />
//           <Route path="/courses" element={<CourseList />} />
//           <Route path="/create-course" element={<CreateCourse />} />

//           <Route path="/instructor-reviews" element={<InstructorReviews />} />
//           <Route
//             path="/instructor-reviews/:instructorId"
//             element={<InstructorReviews />}
//           />
//           <Route path="/submit-review" element={<SubmitReviewForm />} />
//           <Route
//             path="/submit-review/:instructorId"
//             element={<SubmitReviewForm />}
//           />
//           <Route
//             path="/chat"
//             element={
//               <ChatProvider>
//                 <ChatLayout />
//               </ChatProvider>
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// };
// export default App;



import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import LoginPage    from "./pages/Dashboards/LoginPage";
import RegisterPage from "./pages/Dashboards/RegisterPage";
import DashboardLayout  from "./layouts/DashboardLayout";

import StudentRoutes    from "./routes/StudentRoutes";
import TutorRoutes      from "./routes/TutorRoutes";
import AdminRoutes      from "./routes/AdminRoutes";

// import CourseList     from "./pages/Courses/CourseList";
// import AllCourses     from "./pages/Courses/AllCourses";

function PrivateRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="login"    element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route
            path="Dashboard/student/*"
            element={
              <DashboardLayout>
                <StudentRoutes />
              </DashboardLayout>
            }
          />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["tutor"]} />}>
          <Route
            path="Dashboard/tutor/*"
            element={
              <DashboardLayout>
                <TutorRoutes />
              </DashboardLayout>
            }
          />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route
            path="Dashboard/admin/*"
            element={
              <DashboardLayout>
                <AdminRoutes />
              </DashboardLayout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}