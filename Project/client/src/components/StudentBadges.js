import React, { useState, useEffect } from 'react';
import { getMyBadges, awardCourseBadge } from '../api/badgeApi';
import BadgeCard from '../common/badgeCard';
import './StudentBadges.css';

/**
 * Props:
 *  - courses: Array of { _id, title, status }
 */
export default function MyBadges({ courses }) {
  const [badges, setBadges] = useState([]);
  const [claimed, setClaimed] = useState({});

  // load existing badges
  useEffect(() => {
    getMyBadges().then(setBadges).catch(console.error);
  }, []);

  const handleClaim = async courseId => {
    if (claimed[courseId]) return;
    const newBadge = await awardCourseBadge(courseId);
    if (newBadge) {
      setBadges(prev => [...prev, newBadge]);
    }
    setClaimed(prev => ({ ...prev, [courseId]: true }));
  };

  return (
    <div className="my-awards">
      <h2>My Awards</h2>

      <div className="my-awards__claim-section">
        {courses.map(course =>
          course.status === 'complete' ? (
            <button
              key={course._id}
              className="my-awards__claim-btn"
              onClick={() => handleClaim(course._id)}
              disabled={
                claimed[course._id] ||
                badges.some(b => b.course === course._id)
              }
            >
              {badges.some(b => b.course === course._id)
                ? 'Badge Claimed'
                : 'Claim Badge'}
            </button>
          ) : null
        )}
      </div>

      <div className="my-awards__list">
        {badges.length > 0 ? (
          badges.map(b => (
            <BadgeCard
              key={b._id}
              name={b.name}
              courseTitle={b.course.title}
              awardedAt={b.awardedAt[b.awardedAt.length - 1]}
              iconUrl={b.iconUrl}
            />
          ))
        ) : (
          <p>No awards earned yet.</p>
        )}
      </div>
    </div>
  );
}
