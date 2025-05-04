import axios from 'axios';

const BADGE_ENDPOINT = `${process.env.REACT_APP_API_BASE_URL}/badges`;

// Fetch all badges the current student has earned
export const getMyBadges = () =>
  axios.get(BADGE_ENDPOINT).then(res => res.data);

// Trigger badge check for a completed course
export const awardCourseBadge = courseId =>
  axios
    .post(`${BADGE_ENDPOINT}/award`, { courseId })
    .then(res => res.data.awarded);
