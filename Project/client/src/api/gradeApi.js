import axios from "axios";

const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const fetchSubmissions = () =>
    axios.get(`${BASE}/grades/submissions`);

export const submitGrade = (data) =>
    axios.post(`${BASE}/grades`, data);