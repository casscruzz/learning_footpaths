import React from "react";
import styles from "../../css/badges_page/CustomBadgeCard.module.css";

export default function CustomBadgeCard({ badge, onClick }) {
  // Get exhibition data from the badge
  const exhibitions = badge.exhibitions || [];
  const totalExhibitions = exhibitions.length;
  const completedExhibitions = exhibitions.filter((ex) => ex.completed).length;

  // Calculate completion status
  const isCompleted =
    totalExhibitions > 0 && completedExhibitions === totalExhibitions;

  // Calculate progress percentage
  const progressPercentage =
    totalExhibitions > 0 ? (completedExhibitions / totalExhibitions) * 100 : 0;

  const renderBadgeStatus = () => {
    if (isCompleted) {
      return (
        <div className={styles.badgeInfo}>
          <p className={styles.congratsText}>Badge Earned!</p>
          <p className={styles.dateText}>
            {new Date(badge.created_at).toLocaleDateString()}
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
          <span className={styles.currentPoints}>{completedExhibitions}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPoints}>{totalExhibitions}</span>
          <span className={styles.pointsLeft}>
            ({totalExhibitions - completedExhibitions} exhibitions remaining)
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
                  {ex.score}/100 {ex.completed && "✓"}
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
