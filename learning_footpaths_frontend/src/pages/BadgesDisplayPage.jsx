import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/badges_page/BadgesDisplay.module.css";
import { useNavigate } from "react-router-dom";

const POINTS_NEEDED = 150;

export default function BadgesDisplayPage() {
  const navigate = useNavigate();
  const [footpathScores, setFootpathScores] = useState([]);
  const [customBadges, setCustomBadges] = useState([]);
  const [discoveredBadges, setDiscoveredBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discoveryCode, setDiscoveryCode] = useState("");
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoverySuccess, setDiscoverySuccess] = useState(null);

  useEffect(() => {
    fetchBadgeProgress();
  }, []);

  const fetchBadgeProgress = async () => {
    try {
      const [footpathResponse, customBadgesResponse, discoveredBadgesResponse] =
        await Promise.all([
          axios.get("http://localhost:8888/api/user/footpath-scores", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8888/api/user/custom-badges", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8888/api/user/discovered-badges", {
            withCredentials: true,
          }),
        ]);

      setFootpathScores(footpathResponse.data);
      setCustomBadges(customBadgesResponse.data);
      setDiscoveredBadges(discoveredBadgesResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load badges");
      console.error("Error fetching badges:", err);
      setLoading(false);
    }
  };

  const handleDiscoverBadge = async (e) => {
    e.preventDefault();
    setDiscoveryError("");
    setDiscoverySuccess(null);

    try {
      // First check if the badge exists and if we already have it
      const checkResponse = await axios.get(
        `http://localhost:8888/api/discover-badge/${discoveryCode}`,
        { withCredentials: true }
      );

      const badgeInfo = checkResponse.data;

      if (badgeInfo.already_discovered) {
        setDiscoveryError("You already have this badge in your collection");
        return;
      }

      // Add the badge to the user's collection
      const addResponse = await axios.post(
        `http://localhost:8888/api/add-discovered-badge/${discoveryCode}`,
        {},
        { withCredentials: true }
      );

      // Update the success state and refresh badges
      const newBadge = addResponse.data.badge;
      setDiscoverySuccess(newBadge);
      setDiscoveryCode("");
      fetchBadgeProgress();
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 404) {
        setDiscoveryError(
          "Badge not found. Please check the code and try again."
        );
      } else if (error.response?.status === 400) {
        setDiscoveryError(
          error.response.data.error ||
            "You already have this badge in your collection"
        );
      } else {
        setDiscoveryError("Failed to add badge. Please try again.");
      }
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderBadgeCard = (badge) => {
    const isCompleted = badge.total_score >= POINTS_NEEDED;

    if (isCompleted) {
      return (
        <div className={`${styles.badgeCard} ${styles.completed}`}>
          <div className={styles.trophyIcon}>🏆</div>
          <h3 className={styles.badgeTitle}>{badge.footpath_name}</h3>
          <div className={styles.badgeEarned}>Badge Earned!</div>
          <div className={styles.badgeDate}>
            {new Date(badge.completion_date).toLocaleDateString()}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.badgeCard}>
        <div className={styles.trophyIcon}>🏅</div>
        <h3 className={styles.badgeTitle}>{badge.footpath_name}</h3>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(badge.total_score / POINTS_NEEDED) * 100}%`,
            }}
          />
        </div>
        <div className={styles.progressText}>
          {badge.total_score}/{POINTS_NEEDED} points (
          {POINTS_NEEDED - badge.total_score} points needed)
        </div>
      </div>
    );
  };

  const renderCustomBadgeCard = (badge) => {
    const isCompleted = badge.is_completed;

    return (
      <div
        className={`${styles.badgeCard} ${isCompleted ? styles.completed : ""}`}
      >
        <div className={styles.trophyIcon}>{isCompleted ? "🏆" : "🏅"}</div>
        <h3 className={styles.badgeTitle}>{badge.name}</h3>
        {isCompleted ? (
          <>
            <div className={styles.badgeEarned}>Badge Earned!</div>
            <div className={styles.badgeDate}>
              {new Date(badge.completed_at).toLocaleDateString()}
            </div>
          </>
        ) : (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(badge.points_earned / POINTS_NEEDED) * 100}%`,
                }}
              />
            </div>
            <div className={styles.progressText}>
              {badge.points_earned}/{POINTS_NEEDED} points (
              {POINTS_NEEDED - badge.points_earned} points needed)
            </div>
          </>
        )}
        <div className={styles.shareCode}>
          Share this badge with code: <span>{badge.share_code}</span>
        </div>
      </div>
    );
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
                onChange={(e) => setDiscoveryCode(e.target.value.toUpperCase())}
                placeholder="ENTER 5-DIGIT CODE"
                maxLength={5}
                className={styles.codeInput}
              />
              <button type="submit" className={styles.addButton}>
                Add Footpath
              </button>
            </form>
            {discoveryError && (
              <div className={styles.error}>{discoveryError}</div>
            )}
            {discoverySuccess && (
              <div className={styles.success}>
                Successfully added "{discoverySuccess.name}" to your collection!
              </div>
            )}
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
              {footpathScores.map((badge) => (
                <div
                  key={badge.footpath_id}
                  onClick={() =>
                    navigate("/exhibitions", {
                      state: { selectedFootpath: badge.footpath_name },
                    })
                  }
                >
                  {renderBadgeCard(badge)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="custom-footpaths" className={styles.section}>
          <h2>My Custom Footpaths</h2>
          {loading ? (
            <p>Loading badges...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className={styles.badgeGrid}>
              {customBadges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() =>
                    navigate("/exhibitions", {
                      state: { customBadge: badge },
                    })
                  }
                >
                  {renderCustomBadgeCard(badge)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="discovered-footpaths" className={styles.section}>
          <h2>My Discovered Footpaths</h2>
          {loading ? (
            <p>Loading badges...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className={styles.badgeGrid}>
              {discoveredBadges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() =>
                    navigate("/exhibitions", {
                      state: { customBadge: badge },
                    })
                  }
                >
                  {renderCustomBadgeCard(badge)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
