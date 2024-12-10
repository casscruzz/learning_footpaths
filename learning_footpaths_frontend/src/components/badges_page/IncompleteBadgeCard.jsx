import React from "react";
import styles from "../../css/badges_page/IncompleteBadgeCard.module.css";

export default function IncompleteBadgeCard({
  title,
  points,
  pointsNeeded = 150,
}) {
  const pointsLeft = pointsNeeded - points;
  const progressPercentage = (points / pointsNeeded) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.icon}>🏅</div>
      <h2>{title}</h2>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={styles.pointsText}>
          <span className={styles.currentPoints}>{points}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPoints}>{pointsNeeded}</span>
          <span className={styles.pointsLeft}>
            ({pointsLeft} points needed)
          </span>
        </p>
      </div>
    </div>
  );
}
