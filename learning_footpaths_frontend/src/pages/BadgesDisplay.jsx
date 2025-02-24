import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/badges_page/BadgesDisplay.module.css";
import { useNavigate } from "react-router-dom";

export default function BadgesDisplay() {
  const navigate = useNavigate();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discoveryCode, setDiscoveryCode] = useState("");

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/badges", {
        withCredentials: true,
      });
      setBadges(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load badges");
      setLoading(false);
    }
  };

  const handleDiscoverBadge = async (e) => {
    e.preventDefault();
    // Existing discovery code logic here
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderBadgeCard = (badge) => {
    if (badge.completed) {
      return (
        <div
          className={styles.badgeCard}
          style={{ backgroundColor: "var(--green)" }}
        >
          <div className={styles.trophyIcon}>🏆</div>
          <h3 className={styles.badgeTitle}>{badge.name}</h3>
          <div className={styles.badgeEarned}>Badge Earned!</div>
          <div className={styles.badgeDate}>{badge.completionDate}</div>
        </div>
      );
    } else {
      return (
        <div className={styles.badgeCard}>
          <div className={styles.trophyIcon}>🏅</div>
          <h3 className={styles.badgeTitle}>{badge.name}</h3>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(badge.pointsEarned / badge.pointsNeeded) * 100}%`,
              }}
            />
          </div>
          <div className={styles.progressText}>
            {badge.pointsEarned}/{badge.pointsNeeded} points (
            {badge.pointsNeeded - badge.pointsEarned} points needed)
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1>My Badges</h1>

          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={() => scrollToSection("tmm-footpaths")}
            >
              TMM Footpaths
            </button>
            <button
              className={styles.navButton}
              onClick={() => scrollToSection("custom-footpaths")}
            >
              My Custom Footpaths
            </button>
            <button
              className={styles.navButton}
              onClick={() => scrollToSection("discovered-footpaths")}
            >
              My Discovered Footpaths
            </button>
          </div>

          <div className={styles.discoverSection}>
            <h2 className={styles.discoverTitle}>Discover New Badges</h2>
            <p className={styles.discoverDescription}>
              Got a custom footpath you want to try?{" "}
              <span className={styles.boldText}>Enter the code</span> below to
              try it for yourself!
            </p>
            <form onSubmit={handleDiscoverBadge}>
              <input
                type="text"
                value={discoveryCode}
                onChange={(e) => setDiscoveryCode(e.target.value)}
                placeholder="ENTER 5-DIGIT CODE"
                className={styles.codeInput}
              />
              <button type="submit" className={styles.addButton}>
                Add Footpath
              </button>
            </form>
          </div>
        </div>

        <div id="tmm-footpaths" className={styles.section}>
          <h2>The Mind Museum's Learning Footpaths</h2>
          {loading ? (
            <p>Loading badges...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className={styles.badgeGrid}>
              {badges.map((badge) => (
                <div key={badge.id}>{renderBadgeCard(badge)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Other sections will be updated in the next step */}
      </div>
    </div>
  );
}
