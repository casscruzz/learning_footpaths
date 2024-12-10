import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Header.module.css";
import "../css/App.css";
import { Menu } from "lucide-react";

export default function Header() {
  const [badgeCount, setBadgeCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthAndBadges = async () => {
      try {
        // Check if user is logged in
        const authResponse = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setIsLoggedIn(true);

        // If logged in, get badge count
        const badgeResponse = await axios.get(
          "http://localhost:8888/api/user/badge-count",
          { withCredentials: true }
        );
        setBadgeCount(badgeResponse.data.badge_count);
      } catch (error) {
        setIsLoggedIn(false);
        setBadgeCount(0);
      }
    };

    checkAuthAndBadges();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton}>
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>Learning Footpaths</h1>
      </div>

      {isLoggedIn && (
        <div className={styles.badgeSection}>
          <span className={styles.badgeCount}>{badgeCount}</span>
          <span className={styles.trophy}>🏆</span>
        </div>
      )}
    </header>
  );
}
