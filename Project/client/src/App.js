// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import TutorUploadAssignment from './components/TutorUploadAssignment';
import StudentCourseView from './components/StudentCourseView';
import StudentSubmitAssignment from './components/StudentSubmitAssignment';
import CourseList from './pages/Courses/CourseList';
import CreateCourse from './pages/Courses/CreateCourse';

const App = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        {/* 🔗 Navigation Buttons */}
        <nav style={{ marginBottom: '30px' }}>
          <Link to="/"><button>🏠 Home</button></Link>{' '}
          <Link to="/create-course"><button>🆕 Create Course</button></Link>{' '}
          <Link to="/courses"><button>📚 Course List</button></Link>{' '}
          <Link to="/tutor-upload"><button>📤 Tutor - Upload Assignment</button></Link>{' '}
          <Link to="/student-course-view"><button>👩‍🎓 Student - View Courses</button></Link>{' '}
          <Link to="/student-submit"><button>📨 Student - Submit Assignment</button></Link>
        </nav>

        {/* 📌 Route Setup */}
        <Routes>
          <Route path="/" element={<h1>Welcome to Course and Assignment Management</h1>} />
          <Route path="/tutor-upload" element={<TutorUploadAssignment />} />
          <Route path="/student-course-view" element={<StudentCourseView />} />
          <Route path="/student-submit" element={<StudentSubmitAssignment />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/create-course" element={<CreateCourse />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
