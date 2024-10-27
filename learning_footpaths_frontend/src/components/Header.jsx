import styles from "../css/Header.module.css";
export default function Header() {
  return (
    <div className={styles.header}>
      <div>
        <button> Navigation</button> Learning Footpaths{" "}
        {/* TODO: Add Styling to this button, make it hamburger icon */}
      </div>
      <div>5 🏆</div>
      {/* <h1>This header is working! </h1> */}
    </div>
  );
}
