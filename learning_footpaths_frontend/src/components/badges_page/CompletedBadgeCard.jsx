import styles from "../../css/badges_page/CompletedBadgeCard.module.css";
export default function CompletedBadgeCard({ title, dateEarned }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>🏅</div>
      <h2>{title}</h2>
      <p>Congratulations on earning this badge!</p>
      <p>Date Earned: {new Date(dateEarned).toLocaleDateString()}</p>
    </div>
  );
}
