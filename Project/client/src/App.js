import AdminCreateCourse from './components/AdminCreateCourse';
import TutorUploadAssignment from './components/TutorUploadAssignment';
import StudentCourseView from './components/StudentCourseView';
import StudentSubmitAssignment from './components/StudentSubmitAssignment';

function App() {
  return (
    <div>
      <h1>Course & Assignment Portal</h1>
      <AdminCreateCourse />
      <hr />
      <TutorUploadAssignment />
      <hr />
      <StudentCourseView />
      <hr />
      <StudentSubmitAssignment />
    </div>
  );
}
