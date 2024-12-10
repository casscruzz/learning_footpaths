import styles from "../../css/badges_page/CompletedBadgeCard.module.css";

export default function CompletedBadgeCard({ title, dateEarned }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>🏆</div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.badgeInfo}>
        <p className={styles.congratsText}>Badge Earned!</p>
        <p className={styles.dateText}>
          {new Date(dateEarned).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
