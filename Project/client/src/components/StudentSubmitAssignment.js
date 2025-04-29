// import React, { useEffect, useState } from 'react';
// import { getCourses } from '../api/courseApi';
// import { getAssignmentsByCourse } from '../api/assignmentApi';
// // import axios from 'axios';
// import { submitAssignment } from "../api/submissionApi";
// import { Link } from "react-router-dom";
// import "./StudentSubmitAssignment.css";

// const StudentSubmitAssignment = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [assignments, setAssignments] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState('');
//   const [fileUrl, setFileUrl] = useState('');

//   const [noCourses, setNoCourses] = useState(false);
//   const [noAssignments, setNoAssignments] = useState(false);

//   useEffect(() => {
//     getCourses()
//       .then(res => {
//         setCourses(res.data);
//         setNoCourses(res.data.length === 0);
//       })
//       .catch(() => alert("Could not load courses"));
//   }, []);

//   const handleCourseChange = async (e) => {
//     const courseId = e.target.value;
//     setSelectedCourse(courseId);
//     setSelectedAssignment("");   
//     if (!courseId) return;

//     const res = await getAssignmentsByCourse(courseId);
//     setAssignments(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!selectedAssignment) {
//         alert("Please choose an assignment first.");
//         return;
//       }
//       // await axios.post('http://localhost:5000/api/submissions', {
//       //   assignmentId: selectedAssignment,
//       //   fileUrl, // For now this is just a URL; file upload can come later
//       // });
//       await submitAssignment({ assignmentId: selectedAssignment, fileUrl });
//       alert('Assignment submitted!');
//     } catch (err) {
//       alert('Submission failed: ' + err.message);
//     }
//   };

//   return (
//     <div className="sa-wrapper">
//       <Link to="/student-dashboard" style={{ display: "inline-block", marginBottom: "0.75rem", color: "#4CAF50" }}>
//         ← Back to Dashboard
//       </Link>
//       <h2>Submit Assignment</h2>
      
//       {noCourses && (
//         <p style={{ marginBottom: "1rem", color: "#555" }}>
//           You aren't enrolled in any courses yet.
//         </p>
//       )}

//       {!noCourses && noAssignments && selectedCourse && (
//         <p style={{ marginBottom: "1rem", color: "#555" }}>
//           No assignments available for this course.
//         </p>
//       )}
      
//       {!noCourses && (
//       <form onSubmit={handleSubmit}>

//         <select value={selectedCourse} onChange={handleCourseChange}>
//           <option value="">Select Course</option>
//           {courses.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedAssignment}
//           onChange={(e) => setSelectedAssignment(e.target.value)}
//           disabled={!assignments.length}
//         >
//           <option value="">Select Assignment</option>
//           {assignments.map((a) => (
//             <option key={a._id} value={a._id}>
//               {a.title}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="File URL (for now)"
//           value={fileUrl}
//           onChange={(e) => setFileUrl(e.target.value)}
//           required
//           disabled={!selectedAssignment}
//         />

//         <button type="submit" disabled={!selectedAssignment}>
//           Submit
//         </button>
//       </form>
//     )}
//   </div>
// );
// };

// export default StudentSubmitAssignment;


// src/components/StudentSubmitAssignment.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCourses } from "../api/courseApi";
import { getAssignmentsByCourse } from "../api/assignmentApi";
import { submitAssignment } from "../api/submissionApi";

import "./StudentSubmitAssignment.css";

const StudentSubmitAssignment = () => {
  const [courses,   setCourses]          = useState([]);
  const [assignments, setAssignments]    = useState([]);

  const [selectedCourse,     setSelectedCourse]     = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [fileUrl,            setFileUrl]            = useState("");

  const [noCourses,      setNoCourses]      = useState(false);
  const [noAssignments,  setNoAssignments]  = useState(false);

  const [errorMsg,      setErrorMsg]      = useState("");

  useEffect(() => {
    getCourses()
    .then(res => {
      setCourses(res.data);
      setNoCourses(res.data.length === 0);
      setErrorMsg("");                       
    })
    .catch(() => setErrorMsg("Could not load your courses."));
  }, []);

  const handleCourseChange = async e => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedAssignment("");
    setAssignments([]);
    setErrorMsg("");

    if (!courseId) return;

    try {
      const res = await getAssignmentsByCourse(courseId);
      setAssignments(res.data);
      setNoAssignments(res.data.length === 0);
    } catch {
      setErrorMsg("Could not load assignments.");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedAssignment) return;

    try {
      await submitAssignment({ assignmentId: selectedAssignment, fileUrl });
      alert("Assignment submitted!");
      setSelectedAssignment("");
      setFileUrl("");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Submission failed: " + err.message);
    }
  };

  return (
    <div className="sa-wrapper">
      <Link to="/student-dashboard" className="sa-back">
        ← Back to Dashboard
      </Link>

      <h2 className="sa-title">Submit Assignment</h2>

      {errorMsg && (
        <p className="sa-info" style={{ color: "#dc2626" }}>
          {errorMsg}
        </p>
      )}

      {noCourses && !errorMsg && (
        <p className="sa-info">You aren’t enrolled in any courses yet.</p>
      )}

      {!noCourses && noAssignments && selectedCourse && !errorMsg && (
        <p className="sa-info">No assignments available for this course.</p>
      )}

      {!noCourses && (
        <form onSubmit={handleSubmit} className="sa-row">
          {/* course select */}
          <select value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* assignment select */}
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            disabled={!assignments.length}
          >
            <option value="">Select Assignment</option>
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.title}
              </option>
            ))}
          </select>

          {/* file url */}
          <input
            type="text"
            placeholder="File URL (for now)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
            disabled={!selectedAssignment}
          />

          {/* submit button */}
          <button
            type="submit"
            className="sa-btn"
            disabled={!selectedAssignment}
          >
            Submit Assignment
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentSubmitAssignment;