import styles from "../../css/landing_page/FootpathCard.module.css";
export default function FootpathCard({ title }) {
  return (
    <div>
      <button className={styles.footpathButton}>{title}</button>
    </div>
  );
}
