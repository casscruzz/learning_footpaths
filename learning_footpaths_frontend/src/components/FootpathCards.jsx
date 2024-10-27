import styles from "../css/FootpathCards.module.css";
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
      {footpaths.map((footpath, index) => (
        <FootpathCard key={index} title={footpath} />
      ))}
    </div>
  );
}
