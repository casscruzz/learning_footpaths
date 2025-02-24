import React from "react";
import styles from "../../css/badges_page/CustomBadgeCard.module.css";

export default function CustomBadgeCard({ badge, onClick }) {
  // Get exhibition data from the badge
  const exhibitions = badge.exhibitions || [];
  const totalExhibitions = exhibitions.length;
  const completedExhibitions = exhibitions.filter((ex) => ex.completed).length;
  const totalPoints = badge.total_points || 0;
  const pointsNeeded = badge.points_needed || totalExhibitions * 50;

  // Calculate completion status
  const isCompleted = badge.is_completed || totalPoints >= pointsNeeded;

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (totalPoints / pointsNeeded) * 100);

  const renderBadgeStatus = () => {
    if (isCompleted) {
      return (
        <div className={styles.badgeInfo}>
          <p className={styles.congratsText}>Badge Earned!</p>
          <p className={styles.dateText}>
            {new Date(
              badge.completed_at || badge.created_at
            ).toLocaleDateString()}
          </p>
        </div>
      );
    }

    return (
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={styles.pointsText}>
          <span className={styles.currentPoints}>{totalPoints}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPoints}>{pointsNeeded}</span>
          <span className={styles.pointsLeft}>
            ({pointsNeeded - totalPoints} points needed)
          </span>
        </p>
        {exhibitions.length > 0 && (
          <div className={styles.exhibitionProgress}>
            {exhibitions.map((ex) => (
              <div key={ex.id} className={styles.exhibition}>
                <span className={styles.exhibitionName}>{ex.title}</span>
                <span
                  className={`${styles.exhibitionScore} ${
                    ex.completed ? styles.completed : ""
                  }`}
                >
                  {ex.score}/50 {ex.completed && "✓"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${styles.card} ${isCompleted ? styles.completed : ""}`}
      onClick={onClick}
    >
      <div className={styles.icon}>{isCompleted ? "🏆" : "🏅"}</div>
      <h2>{badge.name}</h2>
      {renderBadgeStatus()}
      {badge.share_code && (
        <p className={styles.shareCode}>
          Share this badge with code: <span>{badge.share_code}</span>
        </p>
      )}
    </div>
  );
}
