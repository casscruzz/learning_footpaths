import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import CompletedBadgeCard from "../components/badges_page/CompletedBadgeCard";
import IncompleteBadgeCard from "../components/badges_page/IncompleteBadgeCard";
import styles from "../css/badges_page/BadgesDisplay.module.css";

const POINTS_NEEDED = 150; // Match the backend requirement

export default function BadgesDisplayPage() {
  const [footpathScores, setFootpathScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadgeProgress = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/user/footpath-scores",
          { withCredentials: true }
        );
        setFootpathScores(response.data);
      } catch (err) {
        setError("Failed to load badge progress");
        console.error("Error fetching badge progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeProgress();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loadingState}>Loading your badges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  const completedBadges = footpathScores.filter(
    (score) => score.total_score >= POINTS_NEEDED
  );
  const incompleteBadges = footpathScores.filter(
    (score) => score.total_score < POINTS_NEEDED
  );

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1>My Badges</h1>
          <p className={styles.badgesSummary}>
            {completedBadges.length} of {footpathScores.length} badges earned
          </p>
        </div>

        {completedBadges.length > 0 && (
          <div className={styles.section}>
            <h2>Earned Badges</h2>
            <div className={styles.badgeGrid}>
              {completedBadges.map((badge) => (
                <CompletedBadgeCard
                  key={badge.footpath_id}
                  title={badge.footpath_name}
                  dateEarned={new Date().toISOString()} // You might want to add actual earned date to your backend
                />
              ))}
            </div>
          </div>
        )}

        {incompleteBadges.length > 0 && (
          <div className={styles.section}>
            <h2>Badges in Progress</h2>
            <div className={styles.badgeGrid}>
              {incompleteBadges.map((badge) => (
                <IncompleteBadgeCard
                  key={badge.footpath_id}
                  title={badge.footpath_name}
                  points={badge.total_score}
                  pointsNeeded={POINTS_NEEDED}
                />
              ))}
            </div>
          </div>
        )}

        {footpathScores.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start exploring footpaths to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
