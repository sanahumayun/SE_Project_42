import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollSelection, setEnrollSelection] = useState({});
  const [removeSelection, setRemoveSelection] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get("/api/courses/course-list");
        const studentRes = await axios.get("/api/users?role=student");
        setCourses(courseRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId, studentId) => {
    if (!window.confirm("Enroll this student?")) return;
    try {
      await axios.post(`/api/courses/${courseId}/enroll`, { studentId });
      alert("✅ Student enrolled!");
    } catch (err) {
      console.error(err);
      alert("❌ Enrollment failed.");
    }
  };

  const handleRemove = async (courseId) => {
    const studentId = removeSelection[courseId];
    if (!studentId) return alert("❗ Select a student to remove.");
    if (!window.confirm("Remove this student?")) return;

    try {
      await axios.post(`/api/courses/${courseId}/remove-student`, { studentId });
      alert("✅ Student removed.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove student.");
    }
  };

  if (loading) return <p className="loading-message">Loading courses...</p>;

  return (
    <div className="course-list-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="page-title">Available Courses</h2>
      {courses.length === 0 ? (
        <p className="empty-message">No courses found.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div onClick={() => navigate(`/course/${course._id}`)} className="clickable-course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p className="instructor-info">
                  Instructor: {course.instructorId?.name} ({course.instructorId?.email})
                </p>
              </div>

              <div className="student-enrollment">
                <h4>Enrolled Students</h4>
                <ul>
                  {course.studentsEnrolled?.length ? (
                    course.studentsEnrolled.map((s) => (
                      <li key={s._id}>{s.name} ({s.email})</li>
                    ))
                  ) : (
                    <li>No students enrolled yet.</li>
                  )}
                </ul>

                <div className="enroll-form">
                  <select
                    value={enrollSelection[course._id] || ""}
                    onChange={(e) => setEnrollSelection({ ...enrollSelection, [course._id]: e.target.value })}
                  >
                    <option value="">Select student to enroll</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleEnroll(course._id, enrollSelection[course._id])}>Enroll</button>
                </div>

                <div className="enroll-form">
                  <select
                    value={removeSelection[course._id] || ""}
                    onChange={(e) => setRemoveSelection({ ...removeSelection, [course._id]: e.target.value })}
                  >
                    <option value="">Select student to remove</option>
                    {course.studentsEnrolled?.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                  <button className="remove-btn" onClick={() => handleRemove(course._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
