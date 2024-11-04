import React from "react";
import styles from "../../css/badges_page/IncompleteBadgeCard.module.css";

export default function IncompleteBadgeCard({ title, points }) {
  const totalPoints = 100;
  const pointsLeft = totalPoints - points;

  return (
    <div className={styles.card}>
      <div className={styles.icon}>🏅</div>
      <h2>{title}</h2>
      <div style={{ margin: "16px 0" }}>
        {/* This part is the progress bar, I'm not sure yet how to move this to the css module */}
        <div
          style={{
            height: "10px",
            width: "100%",
            backgroundColor: "#e0e0e0",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(points / totalPoints) * 100}%`,
              backgroundColor: "#76c7c0",
              borderRadius: "5px",
            }}
          ></div>
        </div>
        <p>{pointsLeft} more points to earn this badge</p>
      </div>
    </div>
  );
}
