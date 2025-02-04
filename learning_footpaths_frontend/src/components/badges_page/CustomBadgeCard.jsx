import React from "react";
import styles from "../../css/badges_page/IncompleteBadgeCard.module.css"; // Using the same styles

export default function CustomBadgeCard({ badge, onClick }) {
  const POINTS_NEEDED = badge.exhibitions?.length * 50;
  const currentPoints = badge.exhibitions.reduce((total, ex) => {
    return total + (ex.score || 0);
  }, 0);

  const pointsLeft = POINTS_NEEDED - currentPoints;
  const progressPercentage = (currentPoints / POINTS_NEEDED) * 100;
  const isCompleted = currentPoints >= POINTS_NEEDED;

  if (isCompleted) {
    return (
      <div className={styles.card} onClick={onClick}>
        <div className={styles.icon}>🏆</div>
        <h2>{badge.name}</h2>
        <div className={styles.badgeInfo}>
          <p className={styles.congratsText}>Badge Earned!</p>
          <p className={styles.dateText}>
            {new Date(badge.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.icon}>🏅</div>
      <h2>{badge.name}</h2>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={styles.pointsText}>
          <span className={styles.currentPoints}>{currentPoints}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPoints}>{POINTS_NEEDED}</span>
          <span className={styles.pointsLeft}>
            ({pointsLeft} points needed)
          </span>
        </p>
      </div>
    </div>
  );
}
