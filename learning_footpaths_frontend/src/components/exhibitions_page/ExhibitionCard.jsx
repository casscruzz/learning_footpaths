import styles from "../../css/exhibitions_page/ExhibitionCard.module.css";
export default function ExhibitionCard({ key, title, description }) {
  return (
    <div className={styles.exhibition_card}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
