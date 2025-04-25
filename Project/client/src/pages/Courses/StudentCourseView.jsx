"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./StudentCourseView.css"

const StudentCourseView = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submission, setSubmission] = useState({})

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const authToken = localStorage.getItem("authToken")
        console.log("Using auth token:", authToken) // Check the token
        const res = await axios.get("http://localhost:5000/api/courses/student-course-view", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        setCourses(res.data)
        setLoading(false) // Set loading to false after data is fetched
      } catch (err) {
        console.error("Failed to fetch student courses:", err.response ? err.response.data : err.message)
        setError("Failed to load your courses.")
        setLoading(false) // Set loading to false in case of an error
      }
    }

    fetchEnrolledCourses()
  }, [])

  const handleSubmissionChange = (e, courseId, assignmentId) => {
    setSubmission((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [assignmentId]: e.target.value,
      },
    }))
  }

  const handleSubmitAssignment = async (courseId, assignmentId) => {
    const content = submission[courseId]?.[assignmentId]

    if (!content) {
      alert("Please provide your submission.")
      return
    }

    try {
      const authToken = localStorage.getItem("authToken")
      console.log("Auth token:", authToken);
      if (!authToken) {
        alert("You are not logged in!");
        return;
      }
      const res = await axios.post(
        `http://localhost:5000/api/submission/submit/${assignmentId}`,
        { content },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      alert("Assignment submitted successfully!")
      setSubmission((prev) => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          [assignmentId]: "", // Clear the input after successful submission
        },
      }))
    } catch (err) {
      console.error("Error submitting assignment:", err)
      alert("Failed to submit assignment.")
    }
  }

  if (loading) return <p className="loading-message">Loading your courses...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="student-course-container">
      <h2 className="page-title">My Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p className="empty-message">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="instructor-info">
                Instructor: {course.instructorId?.name} ({course.instructorId?.email})
              </p>
              <p className="student-count">Enrolled Students: {course.studentCount}</p>
              {/* Displaying the assignments for the course */}
              <div className="assignments-section">
                <h4>Assignments</h4>
                {course.assignments.length === 0 ? (
                  <p>No assignments uploaded yet.</p>
                ) : (
                  <ul>
                    {course.assignments.map((assignment) => (
                      <li key={assignment._id} className="assignment-item">
                        <h5>{assignment.title}</h5>
                        <p>{assignment.description}</p>
                        <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

                        {/* Text Box for Submission */}
                        <textarea
                          placeholder="Enter your submission here"
                          value={submission[course._id]?.[assignment._id] || ""}
                          onChange={(e) => handleSubmissionChange(e, course._id, assignment._id)}
                          rows="4"
                          className="submission-textarea"
                        />
                        <button
                          onClick={() => handleSubmitAssignment(course._id, assignment._id)}
                          className="submit-button"
                        >
                          Submit Assignment
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentCourseView
