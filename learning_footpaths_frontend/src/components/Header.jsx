import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Header.module.css";
import "../css/App.css";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import SlidingMenu from "./SlidingMenu";

export default function Header() {
  const [badgeCount, setBadgeCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndBadges = async () => {
      try {
        const authResponse = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setIsLoggedIn(true);

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

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          onClick={() => setIsMenuOpen(true)}
          className={styles.menuButton}
          aria-label="Open menu"
        >
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

      <SlidingMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isLoggedIn}
        onNavigate={handleNavigate}
      />
    </header>
  );
}
