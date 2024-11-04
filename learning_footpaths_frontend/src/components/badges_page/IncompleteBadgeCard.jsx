import React from "react";

export default function IncompleteBadgeCard({ title, points }) {
  const totalPoints = 100;
  const pointsLeft = totalPoints - points;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        width: "200px",
      }}
    >
      <div style={{ fontSize: "48px" }}>🏅</div>
      <h2>{title}</h2>
      <div style={{ margin: "16px 0" }}>
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
