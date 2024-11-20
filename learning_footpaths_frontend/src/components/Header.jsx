import styles from "../css/Header.module.css";
import "../css/App.css";
export default function Header() {
  return (
    <div className={styles.header}>
      {" "}
      {/*TODO: Make sure that this is not in the body so that it can span through the whole margin*/}
      <div>
        <button className={"button"}> – </button> Learning Footpaths{" "}
        {/* TODO: Add Styling to this button, make it hamburger icon */}
      </div>
      <div>5 🏆</div>
      {/* <h1>This header is working! </h1> */}
    </div>
  );
}
