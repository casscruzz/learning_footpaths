export default function CompletedBadgeCard({ title, dateEarned }) {
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
      <p>Congratulations on earning this badge!</p>
      <p>Date Earned: {new Date(dateEarned).toLocaleDateString()}</p>
    </div>
  );
}
