import axios from "axios";
const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const submitAssignment = ({ assignmentId, fileUrl }) =>
  axios.post(`${BASE}/submissions/submit/${assignmentId}`, { fileUrl });
