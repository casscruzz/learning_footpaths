import styles from "../../css/exhibitions_page/ProgressBar.module.css";

export default function ProgressBar({ value, max }) {
  return (
    <div className={styles.progress_bar}>
      <div
        className={styles.progress_bar_completed}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
      {max - value} points left until you complete the badge
    </div>
  );
}
