import styles from "../../css/landing_page/FootpathCards.module.css";
import FootpathCard from "./FootpathCard";
export default function FootpathCards() {
  const footpaths = [
    "Big Question 1",
    "Big Question 2",
    "Big Question 3",
    "Big Question 4",
    "Big Question 5",
    "Big Question 6",
  ];
  return (
    <div className={styles.cardHolder}>
      {footpaths.map((footpath) => (
        <FootpathCard title={footpath} />
      ))}
    </div>
  );
}
