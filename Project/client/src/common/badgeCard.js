import React from 'react';
import './badgeCard.css';

/**
 * Props:
 *  - name: string
 *  - courseTitle: string
 *  - awardedAt: Date|string
 *  - iconUrl: string (optional)
 */
export default function BadgeCard({
  name,
  courseTitle,
  awardedAt,
  iconUrl
}) {
  return (
    <div className="badge-card">
      {iconUrl && (
        <img src={iconUrl} alt={name} className="badge-card__icon" />
      )}
      <div className="badge-card__info">
        <h4 className="badge-card__name">{name}</h4>
        <p className="badge-card__course">Course: {courseTitle}</p>
        <small className="badge-card__date">
          Earned: {new Date(awardedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}
