import styles from "../css/FootpathCard.module.css";
export default function FootpathCard({ key, title }) {
  return (
    <div>
      <button className={styles.footpathButton}>{title}</button>
    </div>
  );
}
