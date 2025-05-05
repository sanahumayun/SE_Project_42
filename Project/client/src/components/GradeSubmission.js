import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubmissions, submitGrade } from "../api/gradeApi";
import "./GradeSubmission.css";

export default function GradeSubmissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions()
      .then((res) =>
        setSubs(
          res.data.map((s) => ({
            ...s,
            assignmentName: s.assignment?.title || "N/A",
            grade: "",
            comment: "",
            status: "idle", 
          }))
        )
      )
      .catch(() => setError("Could not load submissions"))
      .finally(() => setLoading(false));
  }, []);

  const mutateRow = (idx, patch) =>
    setSubs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });

  const handleSubmit = async (idx) => {
    const { _id: submissionId, grade, comment } = subs[idx];
    mutateRow(idx, { status: "saving" });

    try {
      await submitGrade({ submissionId, grade: Number(grade), comment });
      mutateRow(idx, { status: "done" });
    } catch {
      mutateRow(idx, { status: "fail" });
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="grade-wrapper">
      <Link to="/tutor-dashboard" className="back-link">
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
            <th style={{ width: "90px" }}>Action</th>
          </tr>
        </thead>
  
        <tbody>
          {subs.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-submission">
                No submissions yet.
              </td>
            </tr>
          ) : (
            subs.map((s, i) => (
              <tr key={s._id} className={i % 2 ? "alt" : ""}>
                <td>{s.student?.name || "—"}</td>
                <td>{s.course?.title || "—"}</td>
                <td>{s.assignmentName}</td>
  
                <td>
                  <input
                    type="number"
                    min="0"
                    value={s.grade}
                    onChange={(e) =>
                      mutateRow(i, { grade: e.target.value, status: "idle" })
                    }
                  />
                </td>
  
                <td>
                  <input
                    value={s.comment}
                    onChange={(e) =>
                      mutateRow(i, { comment: e.target.value, status: "idle" })
                    }
                  />
                </td>
  
                <td>
                  {s.status === "done" ? (
                    <span className="badge success">✓</span>
                  ) : s.status === "fail" ? (
                    <span className="badge error">✕</span>
                  ) : (
                    <button
                      className="grade-btn"
                      onClick={() => handleSubmit(i)}
                      disabled={!s.grade || s.status === "saving"}
                    >
                      {s.status === "saving" ? "…" : "Submit"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}  