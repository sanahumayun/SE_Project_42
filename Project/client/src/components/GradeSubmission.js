import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchSubmissions, submitGrade } from '../api/gradeApi';
import "./GradeSubmission.css";      

export default function GradeSubmissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState();

  useEffect(() => {
    fetchSubmissions()
      .then(res => {
        setSubs(res.data.map(s => ({ ...s, assignmentName: s.assignment?.title || 'N/A', grade: '', comment: '' })));
      })
      .catch(() => setError('Could not load submissions'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (idx, field, val) => {
    const next = [...subs];
    next[idx][field] = val;
    setSubs(next);
  };

  const handleSubmit = (idx) => {
    const { _id: submissionId, grade, comment } = subs[idx];
    submitGrade({ submissionId, grade: Number(grade), comment })
      .then(() => alert('Graded!'))
      .catch(() => alert('Failed to grade'));
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color:'red' }}>{error}</p>;

  return (
    <div>
      <Link to= "/tutor-dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h2>Grade Student Submissions</h2>
      
      <table className="grade-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Assignment</th>
            <th>Your&nbsp;Grade</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {subs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                No submissions yet.
              </td>
            </tr>
          ) : (
            subs.map((s, i) => (
              <tr key={s._id}>
                <td>{s.student.name}</td>
                <td>{s.course.title}</td>
                <td>{s.assignmentName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={s.grade}
                    onChange={(e) => handleChange(i, "grade", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={s.comment}
                    onChange={(e) => handleChange(i, "comment", e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="grade-btn"
                    onClick={() => handleSubmit(i)}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// src/components/GradeSubmissions.js
// import React from 'react';

// export default function GradeSubmissions() {
//   return (
//     <div style={{ padding: '1rem' }}>
//       <h1>📝 Grade Submissions</h1>
//       <p>This is where tutors will see student assignment submissions and assign grades & feedback.</p>
//     </div>
//   );
// }
