// import styles from "../css/landing_page/LandingPageText.module.css";
import styles from "../../css/landing_page/LandingPageText.module.css";

export default function LandingPageText() {
  return (
    <div className={styles.LandingPageText}>
      <h1>Choose your Adventure!</h1>
      <p className={styles.LandingPageSubText}>
        Our Learning Footpaths are meant for great minds like you to explore!
      </p>
    </div>
  );
}
