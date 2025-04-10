// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import TutorUploadAssignment from './components/TutorUploadAssignment';
import StudentCourseView from './components/StudentCourseView';
import StudentSubmitAssignment from './components/StudentSubmitAssignment';
import StudentProgress from './components/StudentProgress';
import TutorViewProgress from './components/TutorViewProgress';     
import CourseList from './pages/Courses/CourseList';
import CreateCourse from './pages/Courses/CreateCourse';

import InstructorReviews from './components/InstructorReviews';
import SubmitReviewForm from './components/SubmitReviewForm';
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
          <Link to="/instructor-reviews"><button>⭐ Instructor Reviews</button></Link>{' '}
          <Link to="/submit-review"><button>✏️ Submit Review</button></Link>
        </nav>

        {/* 📌 Route Setup */}
        <Routes>
          <Route path="/" element={<h1>Welcome to Course and Assignment Management</h1>} />
          <Route path="/tutor-upload" element={<TutorUploadAssignment />} />
          <Route path="/tutor-progress" element={<TutorViewProgress />} />
          <Route path="/student-course-view" element={<StudentCourseView />} />
          <Route path="/student-submit" element={<StudentSubmitAssignment />} />
          <Route path="/student-progress" element={<StudentProgress />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/create-course" element={<CreateCourse />} />

          <Route path="/instructor-reviews" element={<InstructorReviews />} />
          <Route path="/instructor-reviews/:instructorId" element={<InstructorReviews />} />
          <Route path="/submit-review" element={<SubmitReviewForm />} />
          <Route path="/submit-review/:instructorId" element={<SubmitReviewForm />} />
        </Routes>
      </div>
    </Router>
  );
};

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from '../../context/ChatContext';
import ChatLayout from '../../../Project/client/src/components/components/ChatLayout';
import './App.css';

function App() {
  return (
    <Router>
      <ChatProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<ChatLayout />} />
          </Routes>
        </div>
      </ChatProvider>
    </Router>
  );rr33333333333333333333333
}



export default App;
