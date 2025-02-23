// import styles from "../css/landing_page/LandingPageText.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../css/landing_page/LandingPageText.module.css";

export default function LandingPageText() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        if (response.data && response.data.first_name) {
          setUserName(response.data.first_name);
        }
      } catch (error) {
        console.log("User not logged in");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={styles.LandingPageText}>
      <h1>
        Let's go on an adventure
        {userName ? (
          <span className={styles.userName}>, {userName}!</span>
        ) : (
          "!"
        )}
      </h1>
      <p className={styles.LandingPageSubText}>
        Pick one of the <strong>big questions</strong> below and follow the
        learning footpath!
      </p>
    </div>
  );
}
